using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Rallyhub.Repository;
using StatusCourt = Rallyhub.Service.Enum.Enum.StatusCreateCourt;
namespace Rallyhub.Service.Booking;

public class Service: IService
{
    
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContext;

    public Service(AppDbContext dbContext, IHttpContextAccessor httpContext)
    {
        _dbContext = dbContext;
        _httpContext = httpContext;
    }
    
     public async Task<List<Response.SlotResponse>> GetAvailableSlots(Request.GetAvailableSlotsRequest request)
    {
        var subCourt = await _dbContext.SubCourts
            .Include(x => x.Court)
            .FirstOrDefaultAsync(x => 
                x.Id == request.SubCourtId && 
                x.Court.Status == nameof(StatusCourt.Active));
        if (subCourt == null)
        {
            throw new Exception($"sub court with id {request.SubCourtId} not found");
        }
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (request.Date < today)
        {
            throw new Exception("Không thể xem slot trong quá khứ");
        }
        var configSlots = await _dbContext.ConfigSlots
            .Where(x => x.SubCourtDetailId == request.SubCourtId)
            .OrderBy(x => x.StartTime)
            .ToListAsync();
        var overrides = await _dbContext.OverideSlots
            .Where(x => 
                x.SubCourtDetailId == request.SubCourtId &&
                ( 
                    (!x.IsRecurring && x.Date == request.Date) || 
                    (x.IsRecurring && x.DayOfWeek == request.Date.DayOfWeek)
                            
                )).ToListAsync();
        var exceptions = await  _dbContext.Exceptions
            .Where(x => 
                x.SubCourtDetailId == request.SubCourtId &&
                x.Date == request.Date)
            .ToListAsync(); 
        var result = configSlots.Select(x => new Response.SlotResponse
        {
            StartTime =  x.StartTime,
            EndTime =  x.EndTime,
            Price = x.Price,
            IsAvailable = true
        }).ToList();
        foreach (var ov in overrides)
        {
            result.RemoveAll(x => 
                x.StartTime >= ov.StartTime && 
                x.EndTime <= ov.EndTime);

            result.Add(new Response.SlotResponse
            {
                StartTime = ov.StartTime,
                EndTime = ov.EndTime,
                Price = ov.Price,
                IsAvailable = true
            });
        }
        
        foreach (var ex in exceptions)
        {
            result.RemoveAll(x =>
                x.StartTime < ex.EndTime &&
                x.EndTime > ex.StartTime);
            //
            result.Add(new Response.SlotResponse
            {
                StartTime = ex.StartTime,
                EndTime = ex.EndTime,
                IsAvailable = false
            });
        }
        
        var bookedSlots = await _dbContext.BookingDetails
            .Where(x =>
                x.SubCourtId == request.SubCourtId &&
                x.Date.Date == request.Date.ToDateTime(TimeOnly.MinValue) && 
                (x.Status == "Pending" || x.Status == "Banked"))
            .ToListAsync();
        
        foreach (var slot in result)
        {
            if (!slot.IsAvailable) continue;
            slot.IsAvailable = !bookedSlots.Any(b =>
                b.StartTime < slot.EndTime &&
                b.EndTime > slot.StartTime);
        }
        return result.OrderBy(x => x.StartTime).ToList();
    }
     
    public async Task<Response.CreateBookingResponse> CreateBooking(Request.HoldBookingRequest request)
    {
        //thêm campaign
        var customerIdClaim = _httpContext.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "CustomerId")?.Value;
        if (customerIdClaim == null)
        {
            throw new Exception("Không tìm thấy thông tin của customer");
        }
        var customerId = Guid.Parse(customerIdClaim);

        var availableSlots = await GetAvailableSlots(new Request.GetAvailableSlotsRequest
        {
            SubCourtId = request.SubCourtId,
            Date = request.Date
        });

        foreach (var slot in request.Slots)
        {
            var systemSlot = availableSlots.FirstOrDefault(x =>
                x.StartTime == slot.StartTime
                && x.EndTime == slot.EndTime);

            if (systemSlot == null)
            {
                throw new Exception($"Slot {slot.StartTime}-{slot.EndTime} không tồn tại");
            }

            if (!systemSlot.IsAvailable)
            {
                throw new Exception($"Slot {slot.StartTime}-{slot.EndTime} đã bị đặt");
            }
        }
        
        var dateTime = new DateTimeOffset(request.Date.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
        var bookedSlots = await _dbContext.BookingDetails
            .Where(x =>
                x.SubCourtId == request.SubCourtId &&
                x.Date.Date == dateTime.Date &&
                (x.Status == "Pending" || x.Status == "Banked")).ToListAsync();
        foreach (var slot in request.Slots)
        {
            var conflict = bookedSlots.Any(b =>
                b.StartTime < slot.EndTime &&
                b.EndTime > slot.StartTime);
            if (conflict)
            {
                throw new Exception($"Slot {slot.StartTime}-{slot.EndTime} đã bị người khác đặt");
            }
        }
        
        var totalPrice = request.Slots.Sum(slot =>
            availableSlots.First(x => 
                x.StartTime == slot.StartTime &&
                x.EndTime == slot.EndTime).Price);

        var booking = new Repository.Entity.Booking
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            TotalPrice = totalPrice,
            FinalPrice = totalPrice,
            Status = "Pending",
            ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(30),
            CampaignId = null
        };
        
        var bookingDetails = request.Slots.Select(slot => new Repository.Entity.BookingDetail
        {
            Id = Guid.NewGuid(),
            SubCourtId = request.SubCourtId,
            BookingId = booking.Id,
            Date = dateTime,
            StartTime = slot.StartTime,
            EndTime = slot.EndTime,
            Price = availableSlots.First(x =>
                x.StartTime == slot.StartTime &&
                x.EndTime == slot.EndTime).Price,
            Status = "Pending",
        }).ToList();
        
        await _dbContext.Bookings.AddAsync(booking);
        await _dbContext.BookingDetails.AddRangeAsync(bookingDetails);
        await _dbContext.SaveChangesAsync();

        string bankName = "MBBank";
        string bankAccount = "VQRQAIUZK3222";
        string description = $"RALLYHUB-{booking.Id:N}";
        
        string qrCodeUrl = $"https://qr.sepay.vn/img?" +
                           $"acc={bankAccount}&" +
                           $"bank={bankName}&" +
                           $"amount={booking.FinalPrice}&" +
                           $"des={description}&" +
                           $"template=qronly";
        
        return new Response.CreateBookingResponse
        {
            BookingId = booking.Id,
            TotalPrice = booking.TotalPrice,
            ExpiredAt = booking.ExpiresAt,
            Status = booking.Status,
            Slots = booking.BookingDetails.Select(x => new Response.BookingDetailItem
            {
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                Price = x.Price
            }).ToList(),
            QrCodeUrl = qrCodeUrl
        };
    }
    
    public async Task<bool> SepayWebhookHandler(Request.SepayWebhookRequest request)
    {
        var description = request.Code;
        
        var raw = description.Replace("RALLYHUB", "");
        
        Guid? bookingId = null;
        
        if (raw.Length == 32) 
        {
            var formatted = 
                            $"{raw.Substring(0, 8)}-" +
                            $"{raw.Substring(8, 4)}-" +
                            $"{raw.Substring(12, 4)}-" +
                            $"{raw.Substring(16, 4)}-" +
                            $"{raw.Substring(20, 12)}";
            if (Guid.TryParse(formatted, out var guid))
            {
                bookingId = guid;
            }
        } else {
            throw new Exception("Invalid description format");
        }
        
        if(bookingId == null)
        {
            throw new Exception("BookingId not found in description");
        }
        
        var query = _dbContext.Bookings
            .Where(x => x.Id == bookingId)
            .Include(x => x.BookingDetails);
        
        var booking = await query.FirstOrDefaultAsync();
        if(booking == null)
        {
            throw new Exception("Order not found");
        }
        
        if(booking.Status != "Pending")
        {
            throw new Exception("Order already processed");
        }
        
        if(booking.FinalPrice != request.TransferAmount)
        {
            throw new Exception("Invalid transfer amount");
        }
        
        booking.Status = "Banked";
        _dbContext.Update(booking);
        var result = await _dbContext.SaveChangesAsync();
        if (result > 0)
        {
            return true;
        }
        return false;
    }
}
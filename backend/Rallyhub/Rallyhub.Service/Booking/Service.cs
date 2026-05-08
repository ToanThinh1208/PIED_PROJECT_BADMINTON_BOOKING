using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Rallyhub.Repository;
namespace Rallyhub.Service.Booking;

public class Service: IService
{
    
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContext;
    private readonly Wallet.IService _walletService;

    public Service(AppDbContext dbContext, IHttpContextAccessor httpContext, Wallet.IService walletService)
    {
        _dbContext = dbContext;
        _httpContext = httpContext;
        _walletService = walletService;
    }
    
    public async Task<List<Response.SlotResponse>> GetAvailableSlots(Request.GetAvailableSlotsRequest request)
    {
        var subCourt = await _dbContext.SubCourts
            .Include(x => x.Court)
            .FirstOrDefaultAsync(x => 
                x.Id == request.SubCourtId && 
                x.Court.Status == "Active");
        if (subCourt == null)
        {
            throw new Exception($"Không tìm thấy sân con");
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
    public async Task<Response.CreateBookingResponse> CreateBooking(Request.ListAvailableSlots request)
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
                throw new Exception($"Slot {slot.StartTime}-{slot.EndTime} đã bị đặt hoặc đã khóa");
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
        //campain
        decimal finalPrice =  totalPrice;
        if (request.CampaignId != null)
        {
            var query = await _dbContext.Campaigns
                .FirstOrDefaultAsync(c => 
                    c.Id == request.CampaignId &&
                    c.Code == request.Code &&
                    c.StartDate <= request.Date.ToDateTime(TimeOnly.MinValue) &&
                    c.EndDate >= request.Date.ToDateTime(TimeOnly.MinValue));
            if (query != null)
            {
                throw new Exception("Campaign không tồn tại trong hệ thống");
            }

            finalPrice = totalPrice * (1 - query!.DiscountPercent / 100);
            if (finalPrice <= 0) finalPrice = 0;
        }
        
        var booking = new Repository.Entity.Booking
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            TotalPrice = totalPrice,
            FinalPrice = finalPrice,
            Status = "Pending",
            ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(30),
            CampaignId = request.CampaignId,
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
        string description = $"RA-{booking.Id:N}";
        
        string qrCodeUrl = $"https://qr.sepay.vn/img?" +
                           $"acc={bankAccount}&" +
                           $"bank={bankName}&" +
                           $"amount={booking.FinalPrice}&" +
                           $"des={description}&" +
                           $"template=qronly";
        
        return new Response.CreateBookingResponse
        {
            BookingId = booking.Id,
            TotalPrice = booking.FinalPrice,
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
    public async Task<Response.CreateBookingResponse> CreateBookingByWallet(Request.ListAvailableSlots request)
    {
        var customerIdClaim = _httpContext.HttpContext.User.Claims
            .FirstOrDefault(x => x.Type == "CustomerId")?.Value;
        if (customerIdClaim == null)
        {
            throw new Exception("Không tim thấy thông tin của Customer");
        }
        var customerId = Guid.Parse(customerIdClaim);

        var availableSlots = await GetAvailableSlots(new Request.GetAvailableSlotsRequest
        {
            SubCourtId = request.SubCourtId,
            Date = request.Date,
        });
        foreach (var slot in request.Slots)
        {
            var systemSlot = availableSlots.FirstOrDefault(x =>
                x.StartTime == slot.StartTime &&
                x.EndTime == slot.EndTime);
            if (systemSlot == null)
            {
                throw new Exception($"Slot {slot.StartTime}-{slot.EndTime} không tồn tại");
            }

            if (!systemSlot.IsAvailable)
            {
                throw new Exception($"Slot {slot.StartTime}-{slot.EndTime} đã bị đặt hoặc đã khóa");
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
        decimal finalPrice =  totalPrice;
        if (request.CampaignId != null)
        {
            var query = await _dbContext.Campaigns
                .FirstOrDefaultAsync(c => 
                    c.Id == request.CampaignId &&
                    c.Code == request.Code &&
                    c.StartDate <= request.Date.ToDateTime(TimeOnly.MinValue) &&
                    c.EndDate >= request.Date.ToDateTime(TimeOnly.MinValue));
            if (query != null)
            {
                throw new Exception("Campaign không tồn tại trong hệ thống");
            }

            finalPrice = totalPrice * (1 - query!.DiscountPercent / 100);
            if (finalPrice <= 0) finalPrice = 0;
        }
        var booking = new Repository.Entity.Booking
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            TotalPrice = totalPrice,
            FinalPrice = finalPrice,
            Status = "Pending",
            CampaignId = request.CampaignId,
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
        

        if (!await _walletService.ApartBanlanceFromWallet(customerId, finalPrice, "Wallet"))
        {
            throw new Exception("Wallet apart balance failed");
        }
        booking.Status = "Banked";
        await _dbContext.Bookings.AddAsync(booking);
        await _dbContext.BookingDetails.AddRangeAsync(bookingDetails);
        await _dbContext.SaveChangesAsync();

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
        };

    }
    public async Task<bool> SepayWebhookHandler(Request.SepayWebhookRequest request)    
    {
        var description = request.Code;
        if (description.StartsWith("RA"))
        {
            var raw = description.Replace("RA", "");
    
            if (string.IsNullOrEmpty(raw) || raw.Length < 28)
            {
                throw new Exception("Error code");
            }
            var formatted = 
                $"{raw.Substring(0, 8)}-" +
                $"{raw.Substring(8, 4)}-" +
                $"{raw.Substring(12, 4)}-" +
                $"{raw.Substring(16, 4)}-" +
                $"{raw.Substring(20, 10)}";
        
            Repository.Entity.Booking? targetBooking = null;

            if (Guid.TryParse(formatted, out var exactGuid))
            {
                targetBooking = await _dbContext.Bookings
                    .Include(x => x.BookingDetails)
                    .FirstOrDefaultAsync(x => x.Id == exactGuid);
            }

            if (targetBooking == null)
            {
                targetBooking = await _dbContext.Bookings
                    .Include(x => x.BookingDetails)
                    .Where(x => EF.Functions.TrigramsSimilarity(x.Id.ToString(), formatted) > 0.68)
                    .OrderBy(x => EF.Functions.TrigramsSimilarityDistance(x.Id.ToString(), formatted))
                    .FirstOrDefaultAsync();
            }
            if (targetBooking == null)
            {
                throw new Exception("Not found");
            }   
            if (targetBooking.Status != "Pending")
            {
                throw new Exception("Booking is completed");
            }
            if(targetBooking.FinalPrice != request.TransferAmount)
            {
                throw new Exception("Invalid transfer amount");
            }
        
            targetBooking.Status = "Banked";
            _dbContext.Update(targetBooking);
        }

        if (description.StartsWith("WA"))
        {
            var raw = description.Replace("WA", "");
    
            if (string.IsNullOrEmpty(raw) || raw.Length < 28)
            {
                throw new Exception("Error code");
            }
            var formatted = 
                $"{raw.Substring(0, 8)}-" +
                $"{raw.Substring(8, 4)}-" +
                $"{raw.Substring(12, 4)}-" +
                $"{raw.Substring(16, 4)}-" +
                $"{raw.Substring(20, 10)}";
            
            Repository.Entity.Wallet? targetWallet = null;
            if (Guid.TryParse(formatted, out var exactGuid))
            {
                targetWallet = await _dbContext.Wallets
                    .FirstOrDefaultAsync(x => x.Id == exactGuid);
            }

            if (targetWallet == null)
            {
                targetWallet = await _dbContext.Wallets
                    .Where(x => EF.Functions.TrigramsSimilarity(x.Id.ToString(), formatted) > 0.68)
                    .OrderBy(x => EF.Functions.TrigramsSimilarityDistance(x.Id.ToString(), formatted))
                    .FirstOrDefaultAsync();
            }

            if (targetWallet == null)
            {
                throw new Exception("Not found");
            }
            //check transaction de xem so tien nhan vao
            targetWallet.Balance += request.TransferAmount;
            _dbContext.Update(targetWallet);
        }
        var result = await _dbContext.SaveChangesAsync();
        if (result > 0)
        {
            return true;
        }
        return false;
    }
}
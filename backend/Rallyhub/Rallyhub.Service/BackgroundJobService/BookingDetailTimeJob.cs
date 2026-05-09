using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Quartz;
using Rallyhub.Repository;

namespace Rallyhub.Service.BackgroundJobService;

public class BookingDetailTimeJob : IJob
{
    private const string PendingStatus = "Pending";
    private const string BankedStatus = "Banked";
    private const string CompletedStatus = "Completed";
    private static readonly TimeSpan BookingDetailTime = TimeSpan.FromSeconds(150);
    private readonly AppDbContext _dbContext;
    private readonly ILogger _logger;

    public BookingDetailTimeJob(AppDbContext dbContext, ILogger<BookingDetailTimeJob> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }
    public async Task Execute(IJobExecutionContext context)
    {
        var bankedDetailSeconds = (int)BookingDetailTime.TotalSeconds;
        //EF core ko convert DateTimeOffset.UtcNow -> SQL đc
        var now = DateTimeOffset.UtcNow;
        // Console.WriteLine(now);// 05/09/2026 10:19:46 +00:00 # DB: 07:00:00.000 +0700

        var nowDate = now.Date;
        var nowTime = TimeOnly.FromTimeSpan(now.TimeOfDay);
        
        var pendingBankedBookingDetails = await _dbContext.BookingDetails
             .Where(x => 
                 x.Status == PendingStatus && 
                            (x.Date.Date < nowDate || (x.Date.Date == nowDate && x.EndTime < nowTime)))
             .ToListAsync(context.CancellationToken);
        if (pendingBankedBookingDetails.Count == 0)
        {
            _logger.LogInformation("BookingTimeoutJob: no expired bookings found.");
            return;
        }
        foreach (var item in pendingBankedBookingDetails)
        {
            item.Status = CompletedStatus;
            item.UpdatedAt = now;
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(x => x.Id == item.BookingId);
            if (booking!.Status == BankedStatus)
            {
                booking.Status = CompletedStatus;
                booking.UpdatedAt = now;
            }
            _dbContext.Update(booking);
        }
        
        _dbContext.UpdateRange(pendingBankedBookingDetails);
        await _dbContext.SaveChangesAsync(context.CancellationToken);
        _logger.LogInformation(
            "BookingDetailTimeJob completed: cancelled {CancelledCount} pending orders older than {PendingTimeoutMinutes} minutes.",
            pendingBankedBookingDetails.Count,
            bankedDetailSeconds);
    }
}
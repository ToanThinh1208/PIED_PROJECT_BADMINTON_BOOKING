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
        
        var now = DateTimeOffset.UtcNow;
        
        var pendingBankedBookingDetails = await _dbContext.BookingDetails
            .Where(x => x.Status == PendingStatus && 
                        new DateTimeOffset(x.Date.Date + x.EndTime.ToTimeSpan(), x.Date.Offset) < now)
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
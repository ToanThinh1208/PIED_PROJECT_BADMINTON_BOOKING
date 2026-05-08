using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Rallyhub.Repository;

namespace Rallyhub.Service.SepayService;

public class Service : IService
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContext;
    private readonly Transaction.IService _transactionService;

    public Service(AppDbContext dbContext, IHttpContextAccessor httpContext, Transaction.IService transactionService)
    {
        _dbContext = dbContext;
        _httpContext = httpContext;
        _transactionService = transactionService;
    }
    
    public async Task<bool> BookingSepayWebhookHandler(Request.SepayWebhookRequest request)
    {
        var description = request.Code;
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
        targetBooking.UpdatedAt = DateTimeOffset.UtcNow;

        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == targetBooking.Customer.UserId);
        if (user == null)
        {
            throw new Exception("User not found");
        }
        var wallet = await _dbContext.Wallets.FirstOrDefaultAsync(x => x.UserId == user.Id);
        if (wallet == null)
        {
            throw new Exception("Wallet not found");
        }
        _dbContext.Update(targetBooking);
        var result = await _dbContext.SaveChangesAsync();
        
        var transactionI = new Transaction.Request.CreateTransactionRequest()
        {
            Type = Transaction.Request.TypeList.Payment,
            Amount = request.TransferAmount,
            BalanceBefore = wallet.Balance,
            BalanceAfter =  wallet.Balance - request.TransferAmount,
            Status = "Success",
            WalletId =  wallet.Id,
        };
        if (!await _transactionService.CreateTransaction(transactionI))
        {
            throw new Exception("Error creating transaction");
        }
        return true;
    }
}
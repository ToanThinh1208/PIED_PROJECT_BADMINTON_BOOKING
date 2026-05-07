using Microsoft.EntityFrameworkCore;
using Rallyhub.Repository;

namespace Rallyhub.Service.Transaction;

public class Service : IService
{
    private readonly AppDbContext _dbContext;
    public  Service(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> CheckTotalTransactions(Guid userId)
    {
        var wallet =  await _dbContext.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            throw new Exception("Wallet not found");
        }

        if (wallet.Balance < 0)
        {
            throw new Exception("Balance is less than 0!!!waring");
        }
        
        var query = _dbContext.Transactions.Where(x => x.Wallet.UserId == userId && x.Status == "Success");
        var total = await query.SumAsync(x => (
                                                  x.Type == "Deposit" || x.Type == "Refund" || x.Type == "AdminAdd" ? x.Amount : 0)
                                              - (x.Type == "Payment" || x.Type == "Withdrawal" || x.Type == "AdminDeduct" ? x.Amount : 0));
        if (total < 0)
        {
            throw new Exception("Total amount of transaction is less than 0!!!waring");
        }
        if (total != wallet.Balance)
        {
            throw new Exception("!!!Waring, các giao dịch ko khớp với số dư ví");
        }
        return true;
    }

    public Response.CreateTransactionResponse CreateTransactionRecord(Request.CreateTransactionRequest request)
    {
        if (request.Amount <= 0)
        {
            throw new Exception("Amount must be greater than 0");
        }

        decimal balanceBefore = request.Wallet.Balance;
        decimal balanceAfter = balanceBefore;

        if (request.Type == "Deposit" || request.Type == "Refund" || request.Type == "AdminAdd")
        {
            balanceAfter += request.Amount;
        }
        else if (request.Type == "Payment" || request.Type == "Withdrawal" || request.Type == "AdminDeduct")
        {
            if (balanceBefore < request.Amount)
            {
                throw new Exception("Số dư ví không đủ để thực hiện giao dịch này.");
            }
            balanceAfter -= request.Amount;
        }
        else
        {
            throw new Exception("Invalid transaction type");
        }

        // Tự động cập nhật Wallet để đảm bảo nguyên tắc Atomic
        request.Wallet.Balance = balanceAfter;
        request.Wallet.Version += 1;
        request.Wallet.UpdatedAt = DateTimeOffset.UtcNow;

        var transaction = new Repository.Entity.Transaction
        {
            Id = Guid.NewGuid(),
            Type = request.Type,
            Amount = request.Amount,
            BalanceBefore = balanceBefore,
            BalanceAfter = balanceAfter,
            Status = "Success",
            TransferContent = request.TransferContent,
            BookingId = request.BookingId,
            SePayId = request.SePayId,
            BankRefCode = request.BankRefCode,
            BankAccountNumber = request.BankAccountNumber,
            ActionCode = request.ActionCode,
            Signature = request.Signature,
            WalletId = request.Wallet.Id,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        return new Response.CreateTransactionResponse
        {
            TransactionRecord = transaction
        };
    }
}
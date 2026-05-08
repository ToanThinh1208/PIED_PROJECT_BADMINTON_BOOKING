using Microsoft.EntityFrameworkCore;
using Rallyhub.Repository;

namespace Rallyhub.Service.Transaction;

public abstract class Service : IService
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
                                                  x.Type == "Deposit" || x.Type == "Refund" || x.Type == "AdminUp" ? x.Amount : 0)
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

    public async Task<bool> CreateTransaction(Request.CreateTransactionRequest request)
    {
        var wallet = await _dbContext.Wallets.FirstOrDefaultAsync(x => x.Id == request.WalletId);
        if (wallet == null)
        {
            throw new Exception("Wallet not found");
        }
        var userId = wallet.UserId;
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var newTransaction = new Repository.Entity.Transaction()
        {
            Type = request.Type,
            Amount = request.Amount,
            BalanceBefore = request.BalanceBefore,
            BalanceAfter = request.BalanceAfter,
            SePayId = request.SePayId,
            BankRefCode = request.BankRefCode,
            BankAccountNumber = request.BankAccountNumber,
            TransferContent = request.TransferContent,
            ActionCode = request.ActionCode,
            Signature =  request.Signature,
            Status = request.Status,
            BookingId = request.BookingId,
            WalletId = request.WalletId,
            CreatedAt = DateTimeOffset.UtcNow,
        };
        _dbContext.Transactions.Add(newTransaction);
        
        switch (request.Type)
        {
            case Request.TypeList.Deposit: //nạp tiền
            {
                newTransaction.Amount = request.Amount;
                break;   
            }
            case Request.TypeList.Refund: //hoàn tiền
            {
                newTransaction.Amount = request.Amount;
                break;   
            }
            case Request.TypeList.AdminUp: //admin cộng tiền
            {
                newTransaction.Amount = request.Amount;
                break;   
            }
            case Request.TypeList.Payment: //trả cho ..
            {
                newTransaction.Amount = -request.Amount;
                break;   
            }
            case Request.TypeList.Withdrawal: //rút tiền tiền
            {
                newTransaction.Amount = -request.Amount;
                break;   
            }
            case Request.TypeList.AdminDeduct: //admin trừ tiền
            {
                newTransaction.Amount = -request.Amount;
                break;   
            }
        }
        _dbContext.Update(newTransaction);
        var  result = await _dbContext.SaveChangesAsync();
        if (result > 0)
        {
            return true;
        }
        return false;
    }
}
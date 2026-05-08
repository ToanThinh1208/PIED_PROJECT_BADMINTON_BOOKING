using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Rallyhub.Repository;

namespace Rallyhub.Service.Withdrawal;

public class Service : IService
{
    private readonly AppDbContext _dbcontext;
    private readonly IHttpContextAccessor _httpAccessor;
    private readonly Wallet.IService _walletService;

    public Service(AppDbContext dbContext, IHttpContextAccessor httpAccessor,  Wallet.IService walletService)
    {
        _dbcontext = dbContext;
        _httpAccessor = httpAccessor;
        _walletService = walletService;
    }
    
    public async Task<string> CreateWithdrawalRequest(Request.CreateWithdrawalRequest request)
    {
        var userId = _httpAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "UserId")!.Value;
        var userIdGuild = Guid.Parse(userId);
        var user = await _dbcontext.Users.FirstOrDefaultAsync(x => x.Id == userIdGuild);
        var wallet = await _dbcontext.Wallets.FirstOrDefaultAsync(x => x.UserId == userIdGuild);
        

        var newWithdrawal = new Repository.Entity.Withdrawal()
        {
            Amount = request.Amount,
            BankName = wallet.BankName,
            BankAccountNumber = wallet.BankAccount,
            BankAccountName = wallet.BankAccountName,
            WalletId = wallet.Id,
            CreatedAt = DateTimeOffset.UtcNow
        };
        
        if (!await _walletService.ApartBanlanceFromWallet(userIdGuild, request.Amount, "Wallet"))
        {
            throw new Exception("Wallet apart balance failed");
        }
        
        _dbcontext.Withdrawals.Add(newWithdrawal);
        var result = await _dbcontext.SaveChangesAsync();
        if (result > 0)
        {
            return "Success invited withdrawal";
        }
        return "Failure invited withdrawal";
    }

    public async Task<Base.Response.PageResult<Response.GetWithdrawalResponse>> AdminGetWithdrawalRequest(Request.GetWithdrawalRequest request, Base.Request.Pagination pagination)
    {
        var withdrawals = _dbcontext.Withdrawals.Where(x => x.Status == "Pending");
        if (pagination.Id != null)
        {
            withdrawals = withdrawals.Where(x => x.Id ==  pagination.Id);
        }
        if(pagination.Search != null)
        {
            withdrawals = withdrawals.Where(x => x.Wallet.User.Email.Contains(pagination.Search));
        }
        if (request.UserId != null)
        {
            withdrawals = withdrawals.Where(x => x.Wallet.UserId ==  request.UserId);
        }
        if (request.CreatedAt != null)
        {
            var targetDate = request.CreatedAt.Value.Date;
            var timeZoneOffset = TimeSpan.FromHours(7); 
            var startDate = new DateTimeOffset(targetDate, timeZoneOffset);
            var endDate = startDate.AddDays(1);
            withdrawals = withdrawals.Where(x => x.CreatedAt >= startDate && x.CreatedAt < endDate);
        }
        var total = await withdrawals.CountAsync();
        withdrawals = withdrawals.OrderBy(x => x.CreatedAt);
        withdrawals = withdrawals
            .Skip((pagination.PageIndex - 1) * pagination.PageSize)
            .Take(pagination.PageSize);

        var selectWithdrawal = withdrawals.Select(x => new Response.GetWithdrawalResponse()
        {
            Amount = x.Amount,
            BankName = x.BankName,
            BankAccountNumber = x.BankAccountNumber,
            BankAccountName = x.BankAccountName,
            WalletId = x.WalletId,
            TransactionId = x.TransactionId,
            CreatedAt = x.CreatedAt,
        });

        var listWithdrawal = await selectWithdrawal.ToListAsync();
        var result = new Base.Response.PageResult<Response.GetWithdrawalResponse>()
        {
            Items = listWithdrawal,
            PageIndex = pagination.PageIndex,
            PageSize = pagination.PageSize,
            TotalItems = total
        };
        return result;
    }

    public async Task<string> AdminApprovedWithdrawalRequest(Guid withdrawalRequestId)
    {
        var withdrawalRrquest = await _dbcontext.Withdrawals.FirstOrDefaultAsync(x => x.Id == withdrawalRequestId);
        if (withdrawalRrquest == null)
        {
            throw new Exception("Withdrawal not found");
        }
        if (withdrawalRrquest.Status != "Pending")
        {
            throw new Exception("Withdrawal was rejected");
        }
        withdrawalRrquest.Status = "Approved";
        var result = await _dbcontext.SaveChangesAsync();
        if (result > 0)
        {
            return "Success approved withdrawal";
        }
        return "Failure approved withdrawal";
    }

    public async Task<string> AdminRejectWithdrawalRequest(Guid withdrawalRequestId, string reason)
    {
        var withdrawalRequest = await _dbcontext.Withdrawals.FirstOrDefaultAsync(x => x.Id == withdrawalRequestId);
        if (withdrawalRequest == null)
        {
            throw new Exception("Withdrawal not found");
        }
        if (withdrawalRequest.Status != "Pending")
        {
            throw new Exception("Withdrawal was rejected");
        }
        withdrawalRequest.Status = "Rejected";
        withdrawalRequest.RejectionReason = reason;
        if (!await _walletService.AddBanlanceToWallet(withdrawalRequest.Wallet.UserId, withdrawalRequest.Amount, "Wallet"))
        {
            throw new Exception("Wallet reject balance failed");
        }
        return "Success rejected withdrawal";
    }
}
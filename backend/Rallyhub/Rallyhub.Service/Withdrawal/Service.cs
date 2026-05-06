using Microsoft.AspNetCore.Http;
using Rallyhub.Repository;

namespace Rallyhub.Service.Withdrawal;

public class Service : IService
{
    private readonly AppDbContext _dbcontext;
    private readonly IHttpContextAccessor _httpAccessor;

    public Service(AppDbContext dbContext, IHttpContextAccessor httpAccessor)
    {
        _dbcontext = dbContext;
        _httpAccessor = httpAccessor;
    }
    
    public async Task<string> CreateWithdrawalRequest(Request.CreateWithdrawalRequest request)
    {
        return "string";
    }
}
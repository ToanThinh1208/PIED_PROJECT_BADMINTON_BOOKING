namespace Rallyhub.Service.Withdrawal;

public interface IService
{
    public Task<string> CreateWithdrawalRequest(Request.CreateWithdrawalRequest request);
    public Task<Base.Response.PageResult<Response.GetWithdrawalResponse>> 
        AdminGetWithdrawalRequest(Request.GetWithdrawalRequest request, Base.Request.Pagination pagination);
}
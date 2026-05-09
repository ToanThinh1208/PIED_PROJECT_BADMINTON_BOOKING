namespace Rallyhub.Service.Withdrawal;

public interface IService
{
    public Task<string> CreateWithdrawalRequest(Request.CreateWithdrawalRequest request);
    public Task<Base.Response.PageResult<Response.GetWithdrawalResponse>> 
        AdminGetWithdrawalRequest(Guid? userId, Base.Request.PagingDay pagination);
    public Task<string> AdminApprovedWithdrawalRequest(Guid withdrawalRequestId);
    public Task<string> AdminRejectWithdrawalRequest(Guid withdrawalRequestId, string reason, string? note);
    public Task<Base.Response.PageResult<Response.UsergetWithdrawalResponse>> GetWithdrawalRequest(Base.Request.PagingDay pagination);
}
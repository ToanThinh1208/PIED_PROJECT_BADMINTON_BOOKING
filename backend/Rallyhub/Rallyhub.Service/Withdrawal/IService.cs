namespace Rallyhub.Service.Withdrawal;

public interface IService
{
    public Task<string> CreateWithdrawalRequest(Request.CreateWithdrawalRequest request);
}
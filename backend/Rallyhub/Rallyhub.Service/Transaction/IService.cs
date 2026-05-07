namespace Rallyhub.Service.Transaction;

public interface IService
{
    public Task<bool> CheckTotalTransactions(Guid userId);
    public Task<bool> AddTransaction(Guid userId);
}
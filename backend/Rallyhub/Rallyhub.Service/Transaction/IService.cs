namespace Rallyhub.Service.Transaction;

public interface IService
{
    public Task<bool> CheckTotalTransactions(Guid userId);
    public Response.CreateTransactionResponse CreateTransactionRecord(Request.CreateTransactionRequest request);
}
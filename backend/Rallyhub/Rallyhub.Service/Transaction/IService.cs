namespace Rallyhub.Service.Transaction;

public interface IService
{
    public Task<bool> CheckTotalTransactions(Guid userId);
    public Task<bool> CreateTransaction(Request.CreateTransactionRequest request);
    public Task<Base.Response.PageResult<Response.GetTransactionResponse>> GetTransactionResponse(Base.Request.PagingDay paginDay);
    public Task<Base.Response.PageResult<Response.AdminGetTransactionResponse>> AdminGetTransactionResponse(Guid? userId ,Base.Request.PagingDay paginDay);

}
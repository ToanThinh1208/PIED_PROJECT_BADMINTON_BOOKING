namespace Rallyhub.Service.Transaction;

public class Response
{
    public class CreateTransactionResponse
    {
        public required Repository.Entity.Transaction TransactionRecord { get; set; }
    }
}

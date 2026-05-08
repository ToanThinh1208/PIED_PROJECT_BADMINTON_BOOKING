namespace Rallyhub.Service.Transaction;

public class Request
{
    public class CreateTransactionRequest
    {
        public string Type { get; set; }//kiểu
        public decimal Amount { get; set; }
        public decimal BalanceBefore { get; set; }
        public decimal BalanceAfter  { get; set; }
        public string? SePayId { get; set; }
        public string? BankRefCode { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? TransferContent { get; set; }
        public string? ActionCode { get; set; }
        public string? Signature { get; set; }
        public string Status { get; set; }
        public Guid? BookingId { get; set; }
        public Guid WalletId { get; set; }
        
        public string Gateway { get; set; }
        public string TransactionDate { get; set; }
        public string AccountNumber { get; set; }
        public string SubAccount { get; set; }
        public string Code { get; set; }
        public string Content { get; set; }
        public string TransferType { get; set; }
        public string Description { get; set; }
        public decimal TransferAmount { get; set; }
        public string ReferenceCode { get; set; }
        public decimal Accumulated { get; set; }
        public long Id { get; set; }
    }
}

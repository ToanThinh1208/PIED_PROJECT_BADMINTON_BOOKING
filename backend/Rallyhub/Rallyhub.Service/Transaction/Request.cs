namespace Rallyhub.Service.Transaction;

public class Request
{
    public class CreateTransactionRequest
    {
        public string Type { get; set; }
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
    }
}

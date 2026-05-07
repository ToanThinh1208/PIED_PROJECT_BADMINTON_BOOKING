namespace Rallyhub.Service.Withdrawal;

public class Response
{
    public class GetWithdrawalResponse()
    {
        public decimal Amount { get; set; }
        public string BankName { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankAccountName { get; set; }     
        public Guid WalletId { get; set; }
        public Guid? TransactionId { get; set; } = null;
        public DateTimeOffset CreatedAt { get; set; }
    }
    public string Status { get; set; }
    public string? RejectionReason { get; set; } = null;
    public string? AdminNote { get; set; } = null;
    public Guid? ProcessedByAdminId { get; set; } 
}
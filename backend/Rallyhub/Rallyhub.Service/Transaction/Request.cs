namespace Rallyhub.Service.Transaction;

public class Request
{
    public class CreateTransactionRequest
    {
        public required Repository.Entity.Wallet Wallet { get; set; }
        public required string Type { get; set; }
        public required decimal Amount { get; set; }
        public string? TransferContent { get; set; }
        public Guid? BookingId { get; set; }
        public string? SePayId { get; set; }
        public string? BankRefCode { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? ActionCode { get; set; }
        public string? Signature { get; set; }
    }
}

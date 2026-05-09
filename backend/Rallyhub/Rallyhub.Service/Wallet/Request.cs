namespace Rallyhub.Service.Wallet;

public class Request
{
    public class AddInforWalletRequest()
    {
        public required string BankName { get; set; }
        public required string BankAccount { get; set; }
        public required string  BankAccountName { get; set; }
    }

    // public class AddOrApartFromWalletRequest()
    // {
    //     public required Guid UserId;
    //     public required decimal Amount;
    //     public required string Type;
    // }
}
namespace Rallyhub.Service.Withdrawal;

public class Request
{
    public class CreateWithdrawalRequest()
    {
        public required decimal Amount { get; set; }
    }
}
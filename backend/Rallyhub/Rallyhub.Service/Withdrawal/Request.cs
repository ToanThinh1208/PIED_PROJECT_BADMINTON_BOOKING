namespace Rallyhub.Service.Withdrawal;

public class Request
{
    public class CreateWithdrawalRequest()
    {
        public required decimal Amount { get; set; }
    }
    
    public class GetWithdrawalRequest()
    {
        public Guid? UserId { get; set; } = null;
        public DateTimeOffset? CreatedAt { get; set; }  = null;

    }
    
}
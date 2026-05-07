namespace Rallyhub.Service.Booking;

public class Request
{
    public class GetAvailableSlotsRequest
    {
        public Guid SubCourtId { get; set; }
        public DateOnly Date { get; set; }
    }
    public class SlotRequest
    {
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
    public class HoldBookingRequest
    {
        public Guid SubCourtId { get; set; }
        public DateOnly Date { get; set; }
        public List<SlotRequest> Slots { get; set; } = new();
    }
    
    public class SepayWebhookRequest
    {
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
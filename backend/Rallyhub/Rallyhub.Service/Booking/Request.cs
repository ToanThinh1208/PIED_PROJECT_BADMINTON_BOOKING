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
    public class ListAvailableSlots
    {
        public Guid SubCourtId { get; set; }
        public DateOnly Date { get; set; }
        public string? Code {get; set;}
        public Guid? CampaignId { get; set; }
        public List<SlotRequest> Slots { get; set; } = new();
    }
    
}
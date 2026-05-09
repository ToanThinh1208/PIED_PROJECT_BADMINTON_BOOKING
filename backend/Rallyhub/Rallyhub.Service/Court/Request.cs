namespace Rallyhub.Service.Court;

public class Request
{
    public class SearchByFilterRequest: Base.Request.PagingRequest
    {
        public string? Keyword { get; set; }
        public string? SortBy { get; set; }
        public bool IsDescending { get; set; }
    }
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
    
}
 
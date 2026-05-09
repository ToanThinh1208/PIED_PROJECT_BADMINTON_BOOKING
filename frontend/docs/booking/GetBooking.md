lịch sử đặt sân của 1 người, coi các trạng thái, và thông tin của các booking có phân trang

Authen:
Customer & owner

Request:
```csharp
public class PagingRequest  
{  
    public int PageSize { get; set; } = 10;  
    public int PageIndex { get; set; } = 1;  
}  

public class PagingDay2 : Pagination  
{  
    public DateOnly? Date { get; set; }  
}
```

Response:
```csharp
public class GetBookingResponse  
{  
    public Guid BookingId { get; set; }  
    public decimal FinalPrice { get; set; }  
    public string Status { get; set; } = null!;  
    public string CourtName { get; set; } = null!;  
    public string Address { get; set; } = null!;  
    public IEnumerable<SlotsResponse> SlotsResponses = new List<SlotsResponse>();  
    public string PhoneNumber { get; set; } = null!;  
    public string UrlMap { get; set; } = null!;  
}  
  
public class SlotsResponse  
{  
    public Guid SlotId { get; set; }  
    public TimeOnly StartTime { get; set; }  
    public TimeOnly EndTime { get; set; }  
    public decimal Price { get; set; }  
    }
```
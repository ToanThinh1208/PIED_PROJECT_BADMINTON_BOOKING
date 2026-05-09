cái này cũng là người dùng đặt sân, nhưng mà sài tiền trong ví, ko đủ thì ra ngoài nạp.
tính năng nạp bên trong nếu ví còn thiếu, coi (comming soon)

Authen:
Customer & owner

**Request:**
```cSharp
public class ListAvailableSlots  
{  
    public Guid SubCourtId { get; set; }  
    public DateOnly Date { get; set; }  
    public string? Code {get; set;}  
    public Guid? CampaignId { get; set; }  
    public List<SlotRequest> Slots { get; set; } = new();  
}
```

**Response:**
```csharp
public class CreateBookingResponse  
{  
    public Guid BookingId {get; set;}  
    public decimal TotalPrice {get; set;}  
    public DateTimeOffset ExpiredAt {get; set;}  
    public string Status { get; set; } = null!;  
    public List<BookingDetailItem> Slots { get; set; } = new();  
    public string QrCodeUrl { get; set; } = null!;  
}
```
người dùng chọn các slot để đặt sân và sinh mã qr chuyển khoản. cái này đặt sân băng chuyển khoản

**Authen:**
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
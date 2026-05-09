hiển thị cho người dùng thấy giao diện,
có các sân con nào, sân con đó có các slot nào và từ mấy giờ đến mấy giờ (mặc định 30p), giá tiền bao nhiêu, đã bị block hay trưa, ko thể xem slot trong quá khứ, có thể chọn các ngày khác nhau

**Authen:**
Customer & owner

**Request:**
```csharp
public class GetAvailableSlotsRequest  
{  
    public Guid SubCourtId { get; set; }  
    public DateOnly Date { get; set; }  
}
```

**Response:**
```csharp
public class SlotResponse  
{  
    public TimeOnly StartTime { get; set; }  
    public TimeOnly EndTime { get; set; }  
    public decimal Price { get; set; }  
    public bool IsAvailable { get; set; }  
}
```
đã đặt sân và chỉn tiền rồi mà muốn hủy để lấy lại tiền, thì cần đáp ứng đủ điều kiện là chưa lố thời gian hoàn tiền mà chủ sân đó quy định

Authen:
Customer & owner

Request:
```csharp
Guild bookingId
```

Response:
```csharp
public class BookingRefundResponse  
{  
    public Guid BookingId { get; set; }  
    public string Status { get; set; } = null!;  
    public decimal RefundAmount { get; set; }  
    public string Message { get; set; } = null!;  
}
```
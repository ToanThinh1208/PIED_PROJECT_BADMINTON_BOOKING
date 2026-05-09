người dùng muốn nạp tiền vào ví, nhập số tiền vào
QrCodeUrl là hình ảnh mã qr

**Authen:**
Customer & owner

**Request:**
```csharp
decimal requestAmount
```

**Response:**
```csharp
public class AddBalanceToWalletFromPaymentResponse  
{  
    public Guid Id { get; set; }  
    public decimal Amount { get; set; }  
    public string QrCodeUrl { get; set; } = null!;  
}
```
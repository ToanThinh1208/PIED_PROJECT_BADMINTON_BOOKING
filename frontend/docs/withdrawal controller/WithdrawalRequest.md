khi người dùng thấy tài khoản của họ đủ nhiều tiền thi họ muốn rút tiên, họ sẽ tạo 1 cái đơn để admin check sem họ có xứng đáng với số tiền này ko
khi tạo tiền sẽ trừ liền lun

**Authen:**
Customer & owner

**Request:**
```csharp
public class CreateWithdrawalRequest()  
{  
    public required decimal Amount { get; set; }  
}
```

**Response:**
```csharp
true
"Success create withdrawal"
```
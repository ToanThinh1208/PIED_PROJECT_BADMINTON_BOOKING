khi người dùng chuyển khoản thì sepay sẽ check là đã thực sự chuyển qua và thành công chưa.
RA chuyển tiền thành toán sân, WA chuyển tiền vào ví

NOTE, ko truyền request vào, vì thằng sepay sẽ truyền vào
tìm hiểu thêm

**Request:**
```csharp
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
```

Response:
```csharp
bool true
```
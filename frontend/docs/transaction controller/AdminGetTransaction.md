admin muốn coi biến động số dư của 1 đối tượng nghi vấn nào đó

**Authen:**
Admmin

**Request:**
```csharp
Guid? userId
public class Pagination  
{  
    public Guid? Id { get; set; } //id của chính xác transation  
    public string? Search { get; set; }  //mail của user muons kiếm
    public int PageSize { get; set; } = 10;  
    public int PageIndex { get; set; } = 1;  
}  
public class PagingDay : Pagination  
{  
    public DateOnly? Date { get; set; }  //lọc theo ngày
}
```

**Response:**
```csharp
public class GetTransactionResponse  
{  
    public Guid Id { get; set; }  
    public string? Type { get; set; }  
    public decimal Amount { get; set; }  
    public string? BankRefCode { get; set; }  
    public string? BankAccountNumber { get; set; }  
    public string? Status { get; set; }  
    public Guid? BookingId { get; set; }  
}  
public class AdminGetTransactionResponse : GetTransactionResponse  
{  
    public string? Mail { get; set; }  
    public string? AvatarUrl { get; set; }  
    public string? FirstName { get; set; }  
    public string? LastName { get; set; }  
    public decimal BalanceBefore { get; set; }  
    public decimal BalanceAfter  { get; set; }  
    public string? SePayId { get; set; } //unique  
    public string? TransferContent { get; set; }  
    public string? ActionCode { get; set; } //unique  
    public string? Signature { get; set; }  
    public Guid WalletId { get; set; }  
    public DateTimeOffset CreatedAt { get; set; }  
    public DateTimeOffset UpdatedAt { get; set; }  
}
```
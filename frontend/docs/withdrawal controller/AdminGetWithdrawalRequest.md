admin sem các yêu cầu đòi tiền mà họ nhận được lúc thức dậy

**Authen:**
Admin

**Request:**
```csharp
Guid? userId
public class Pagination  
{  
    public Guid? Id { get; set; }  //id của cái đơn đòi tiền
    public string? Search { get; set; }  
    public int PageSize { get; set; } = 10;  
    public int PageIndex { get; set; } = 1;  
}
public class PagingDay : Pagination  
{  
    public DateOnly? Date { get; set; }  //lọc ngày
}
```

**Response:**
```csharp
public class GetWithdrawalResponse()  
{  
    public Guid Id { get; set; }  
    public Guid UserId { get; set; }  
    public string? Email { get; set; } = null;  
    public string? Avatar { get; set; } = null;  
    public string? FirstName { get; set; } = null;  
    public string? LastName { get; set; } = null;  
    public decimal Amount { get; set; }  
    public string? BankName { get; set; } = null;  
    public string? BankAccountNumber { get; set; } = null;  
    public string? BankAccountName { get; set; }      = null;  
    public Guid WalletId { get; set; }  
    public Guid? TransactionId { get; set; } = null;  
    public DateTimeOffset CreatedAt { get; set; }  
}
```
người dùng muốn check sem tiền họ đã đc duyệt hay chưa

Authen:
Customer & owner

Request:
```csharp
public class Pagination  
{  
    public Guid? Id { get; set; }  //bỏ
    public string? Search { get; set; }  //bỏ
    public int PageSize { get; set; } = 10;  
    public int PageIndex { get; set; } = 1;  
}  
public class PagingDay : Pagination  
{  
    public DateOnly? Date { get; set; }  //lọc theo ngày
}
```

Response:
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
public class UsergetWithdrawalResponse() : GetWithdrawalResponse  
{  
    public string Status { get; set; }   
public string? RejectionReason { get; set; }  
    public string? AdminNote { get; set; }  
    public Guid? ProcessedByAdminId { get; set; }   
public Guid? TransactionId { get; set; }  
    public DateTimeOffset UpdatedAt { get; set; }  
}
```
người dụng muốn coi lại các biến động số dư của tài khoản họ

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
public class PagingRequest  
{  
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
```
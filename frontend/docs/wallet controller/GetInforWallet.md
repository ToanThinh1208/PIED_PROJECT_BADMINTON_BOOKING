xem thông tin về ví của người dùng đó

Authen:
Customer & owner

**Request:**
ko có

**Response:**
```csharp
public class GetInfoWalletResponse  
{  
    public Guid Id { get; set; }  
    public string FirstName { get; set; } = null;  
    public string LastName { get; set; } = null;  
    public string? BankName { get; set; } = null;  
    public string? BankAccount { get; set; } = null;  
    public string? BankAccountName { get; set; } = null;  
    public decimal Balance { get; set; }  
}
```
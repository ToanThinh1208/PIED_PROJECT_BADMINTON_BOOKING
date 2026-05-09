1 user khi đc tạo ra đã đc tạo luôn cả wallet rồi, nhưng các thông tin là mặc định, null, nên khi người dùng muốn thêm tài khoản thì nhập tên và tk vào

**Authen:**
Customer & owner

**Request:**
``` csharp
public class AddInforWalletRequest()  
{  
    public required string BankName { get; set; }  
    public required string BankAccount { get; set; }  
    public required string  BankAccountName { get; set; }  
}
```

**Response:**
```csharp
true
string "Success add infor wallet"
false
string "Failed add infor wallet"
```
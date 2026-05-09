API
đăng kí ngừi dùng, lưu tạm vào trong redis tài khoản và mk đã đc hash và otp và các thông tin đăng kí, tồn tại trong 5p. mỗi lần án lại thì sẽ gửi otp lại qua mail, mỗi lần gửi lại cách nhau 60s(time to live). gừi otp qua mail thông qua mailService
khi ấn đăng kí thì ko đợi service gửi đc qa mail rồi mới thực hiện các hành động khác. job sẽ gửi liền khi người dùng ấn gửi otp (fire-and-forget) GenerateAndSendOtpAsync

**Request**
```CSharp 
public class UserRequest  
{  
    public required string FirstName { get; set; }  
    public required string LastName { get; set; }  
    public string? PhoneNumber { get; set; }  
}  
public class RegisterRequest : UserRequest  
{  
    public required string Email { get; set; }  
    public required string  RawPassword { get; set; }  
}
```


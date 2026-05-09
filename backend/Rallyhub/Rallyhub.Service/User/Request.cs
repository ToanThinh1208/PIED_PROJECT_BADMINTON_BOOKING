using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Rallyhub.Service.User;

public class Request
{
    public class UserRequest
    {
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        public string? PhoneNumber { get; set; }
    }
    public class RegisterRequest : UserRequest
    {
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string RawPassword { get; set; } = null!;
    }

    public class UpdateProfile
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AvatarUrl  { get; set; }
    }
    
    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
    public class CreateAndUpdateWalletRequest
    {
        public required string BankName { get; set; } 
        public required string BankAccount { get; set; }
    }
    
}
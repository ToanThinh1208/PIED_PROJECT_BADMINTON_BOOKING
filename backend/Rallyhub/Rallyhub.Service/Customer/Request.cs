using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Rallyhub.Service.Customer;

public class Request
{
    public class OwnerRequestRequest : User.Request.UserRequest
    {
        [Required]
        public string BusinessName { get; set; } = null!;
        [Required]
        public string TaxCode { get; set; } = null!;
        [Required]
        public string BusinessAddress { get; set; } = null!;
        [Required]
        public IFormFile BusinessLicenseUrl { get; set; } = null!; // Ảnh giấy phép

        [Required]
        public string IdentityNumber { get; set; } = null!; // Số CCCD
        [Required]
        public IFormFile IdentityCardFrontUrl { get; set; } = null!; // Ảnh mặt trước CCCD
        [Required]
        public IFormFile IdentityCardBackUrl { get; set; } = null!; // Ảnh mặt sau CCCD
    }
    

    public class CancelBooking
    {
        public Guid BookingId  { get; set; }
    }

    public class AddCourtLikeListRequest
    {
        public Guid CourtId  { get; set; }
        public required string CourtName  { get; set; }
        public required string CourtAddress   { get; set; }
    }
    public class DeteleCourtLikeListRequest
    {
        public Guid CourtId  { get; set; }
    }
}
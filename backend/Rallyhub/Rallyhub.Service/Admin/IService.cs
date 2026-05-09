using Org.BouncyCastle.Ocsp;

namespace Rallyhub.Service.Admin;

public interface IService
{
//UserMethod
    public Task<Base.Response.PageResult<Response.UserDto>> FilterUser(Request.FilterUserRequest request);
    public Task<Response.UserDto> UserDetail(Request.UserDetailRequest request);
    public Task<Base.Response.PageResult<Response.AdminGetOwnerRequestResponse>> AdminGetOwnerRequest(Base.Request.Pagination request);
    public Task<string> AdminApprovedOwnerRequest(Guid ownerRequestId);
    public Task<string> AdminRejectOwnerRequest(Guid ownerRequestId, string? rejectReason);
    public Task BanAndUnbanUser(Request.BanAndUnbanUserRequest request);
    public Task<Base.Response.PageResult<Response.AdminGetPendingCourtsResponse>> AdminGetPendingCourts (Base.Request.Pagination request);  
    public Task<string> AdminApprovePendingCourt(Guid courtId);  
    public Task<string> AdminRejectPendingCourt(Guid courtId, string? rejectReason);
    public Task<List<Response.GetBookingDetailStatusRefundPendingResponse>> GetBookingDetailStatusRefundPending();
    public Task<Response.GetWalletResponse> GetWallet(Request.GetWalletRequest request);
    public Task<string> AddBalanceToUser(Request.AddBalanceRequest request);
//CourtMethod
    public Task DeleteCourt(Guid id);
}
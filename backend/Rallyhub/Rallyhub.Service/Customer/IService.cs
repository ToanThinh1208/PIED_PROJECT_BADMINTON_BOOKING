namespace Rallyhub.Service.Customer;

public interface IService
{
    public Task<string> OwnerRequest(Request.OwnerRequestRequest model);
    public Task<Base.Response.PageResult<Response.GetOwnerRequestResponse>> GetOwnerRequest(Base.Request.PagingRequest request);
   // public Task<bool> CheckCancelBooking(Request.CancelBooking request);
    //public Task CancelBooking(Request.CancelBooking request);

    public Task<Base.Response.PageResult<Response.LikeListResponse>> GetAllLikeList(Base.Request.PagingRequest request);
    public Task AddCourtLikeList(Request.AddCourtLikeListRequest request);
    public Task DeleteCourtLikeList(Request.DeteleCourtLikeListRequest request);
    public Task<Base.Response.PageResult<Response.BookingResponse>> GetAllBooking (Base.Request.PagingRequest request);
}
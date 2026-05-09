namespace Rallyhub.Service.Booking;

public interface IService
{
    public Task<List<Response.SlotResponse>> GetAvailableSlots(Request.GetAvailableSlotsRequest request);
    public Task<Response.CreateBookingResponse> CreateBooking(Request.ListAvailableSlots request);
    public Task<Response.CreateBookingResponse> CreateBookingByWallet(Request.ListAvailableSlots request);
    public Task<Response.BookingRefundResponse> BookingRefund(Guid bookingId);
    public Task<string> CanCelBooking(Guid bookingId);
    public Task<Response.GetBookingResponse> GetBooking(Base.Request.PagingDay2 pagingDay2);
}
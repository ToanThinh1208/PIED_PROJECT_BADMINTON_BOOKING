namespace Rallyhub.Service.Booking;

public interface IService
{
    public Task<List<Response.SlotResponse>> GetAvailableSlots(Request.GetAvailableSlotsRequest request);
    public Task<Response.CreateBookingResponse> CreateBooking(Request.HoldBookingRequest request);
    public Task SepayWebhookHandler(Request.SepayWebhookRequest request);
}
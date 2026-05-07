using Microsoft.AspNetCore.Mvc;
using Rallyhub.Service.Booking;
using Rallyhub.Service.Models;

namespace Rallyhub.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BookingController: ControllerBase
{
    private readonly IService _bookingService;

    public BookingController(IService bookingService)
    {
        _bookingService = bookingService;
    }
    
    [HttpGet("CustomerGetAvailableSlots")]
    public async Task<IActionResult> GetAvailableSlots([FromQuery] Request.GetAvailableSlotsRequest request)
    {
        var result = await _bookingService.GetAvailableSlots(request);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
    [HttpPost("CustomerCreateBooking")]
    public async Task<IActionResult> CreateBooking([FromBody] Request.HoldBookingRequest request)
    {
        var result = await _bookingService.CreateBooking(request);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
    [HttpPost("SepayWebhookHandler")]
    public async Task<IActionResult> SepayWebhookHandler([FromBody] Request.SepayWebhookRequest request)
    {
        await _bookingService.SepayWebhookHandler(request);
        return Ok(ApiResponseFactory.SuccessResponse( "Success","Success" 
            , HttpContext.TraceIdentifier));
    }
}
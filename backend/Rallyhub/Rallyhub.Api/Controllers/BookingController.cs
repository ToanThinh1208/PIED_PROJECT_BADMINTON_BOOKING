using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rallyhub.Api.Extention;
using Rallyhub.Service.Booking;
using Rallyhub.Service.Models;

namespace Rallyhub.Api.Controllers;

[Authorize(Policy = JwtExtensions.CustomerPolicy)]
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
    public async Task<IActionResult> CreateBooking([FromBody] Request.ListAvailableSlots request)
    {
        var result = await _bookingService.CreateBooking(request);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
    [HttpPost("CustomerCreateBookingByWallet")]
    public async Task<IActionResult> CreateBookingByWallet([FromBody] Request.ListAvailableSlots request)
    {
        var result = await _bookingService.CreateBookingByWallet(request);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
    [HttpPatch("BookingRefund")]
    public async Task<IActionResult> BookingRefund(Request.AdminRefundRequest request)
    {
        var result = await _bookingService.BookingRefund(request);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
}
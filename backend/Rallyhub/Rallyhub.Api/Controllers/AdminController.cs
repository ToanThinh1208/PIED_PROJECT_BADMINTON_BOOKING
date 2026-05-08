using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rallyhub.Api.Extention;
using Rallyhub.Repository;
using Rallyhub.Service.Admin;
using Rallyhub.Service.Models;
using Enum = Rallyhub.Service.Enum.Enum;

namespace Rallyhub.Api.Controllers;

[Authorize(Policy = JwtExtensions.AdminPolicy)]
[Route("api/[controller]")]
public class AdminController: ControllerBase
{
    private readonly IService _adminService;

    public AdminController(IService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("FilterUser")]
    public async Task<IActionResult> FilterUser ([FromQuery]Request.FilterUserRequest request)
    {
        var result = await _adminService.FilterUser(request);
        return Ok(ApiResponseFactory.SuccessResponse
            (result, "Success you!", HttpContext.TraceIdentifier));
    }

    [HttpGet("getUserDetailById")]
    public async Task<IActionResult> UserDetail([FromQuery]Request.UserDetailRequest  request)
    {
        var result = await _adminService.UserDetail(request);
        return Ok(ApiResponseFactory.SuccessResponse
            (result, "Success you!",  HttpContext.TraceIdentifier));
    }
    
    [HttpGet("GetOwnerRequest")]
    public async Task<IActionResult> AdminGetOwnerRequest([FromQuery]Service.Base.Request.Pagination request)
    {
        var result = await _adminService.AdminGetOwnerRequest(request);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
    
    [HttpGet("AcceptCreateOwner")]
    public async Task<IActionResult> AdminAcceptOwnerRequest(Guid ownerRequestId)
    {
        var result = await _adminService.AdminApprovedOwnerRequest(ownerRequestId);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
    
    [HttpGet("RejectCreateOwner")]
    public async Task<IActionResult> AdminRejectOwnerRequest(Guid ownerRequestId, string? rejectReason)
    {
        
        var result = await _adminService.AdminRejectOwnerRequest(ownerRequestId, rejectReason);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
    [HttpDelete("DeleteCourt/{id}")]
    public async Task<IActionResult> DeleteCourt(Guid id)
    {
        await _adminService.DeleteCourt(id);
        return Ok(ApiResponseFactory.SuccessResponse
            ("Success you!",HttpContext.TraceIdentifier));
    }
    [HttpPatch("BanAndUnbanUser")]
    public async Task<IActionResult> BanAndUnbanUser(Service.Admin.Request.BanAndUnbanUserRequest request)
    {
        await _adminService.BanAndUnbanUser(request);
        return Ok(ApiResponseFactory.SuccessResponse
            ("Success you!",HttpContext.TraceIdentifier));
    }
    
    [HttpGet("GetAllPendingCourts")]  
    public async Task<IActionResult> AdminGetAllPendingCourts([FromQuery]Service.Base.Request.Pagination request )  
    {  
        var result = await _adminService.AdminGetPendingCourts(request);  
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success you!", HttpContext.TraceIdentifier));  
    }  
  
    [HttpPatch("RejectPendingCourt/{courtId}")]  
    public async Task<IActionResult> RejectPendingCourt(Guid courtId, [FromBody] Request.RejectPendingCourtsRequest request)  
    {  
        await _adminService.RejectPendingCourt(courtId, request);  
        return Ok(ApiResponseFactory.SuccessResponse( "","Success you!", HttpContext.TraceIdentifier));  
    }  
  
    [HttpPatch("ApprovePendingCourt/{courtId}")]  
    public async Task<IActionResult> ApprovePendingCourt(Guid courtId)  
    {  
        await _adminService.ApprovePendingCourt(courtId);  
        return Ok(ApiResponseFactory.SuccessResponse( "","Success you!"
            , HttpContext.TraceIdentifier));  
    }

    [HttpPatch("Refund")]
    public async Task<IActionResult> Refund(Request.RefundRequest request)
    {
        var result = await _adminService.Refund(request);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
    [HttpGet("GetWallet")]
    public async Task<IActionResult> GetWallet([FromQuery]Request.GetWalletRequest request)
    {
        var result = await _adminService.GetWallet(request);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
    [HttpGet("GetBookingDetailStatusRefundPending")]
    public async Task<IActionResult> GetBookingDetailStatusRefundPending()
    {
        var result = await _adminService.GetBookingDetailStatusRefundPending();
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }

    [HttpPost("AddBalanceToUser")]
    public async Task<IActionResult> AddBalanceToUser([FromBody] Request.AddBalanceRequest request)
    {
        var result = await _adminService.AddBalanceToUser(request);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success you!", HttpContext.TraceIdentifier));
    }
}
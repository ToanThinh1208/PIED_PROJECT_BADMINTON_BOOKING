using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rallyhub.Api.Extention;
using Rallyhub.Service.Models;
using Rallyhub.Service.Withdrawal;

namespace Rallyhub.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class WithdrawalController : ControllerBase
{
    private readonly IService _withdrawalService;

    public WithdrawalController(IService withdrawalService)
    {
        _withdrawalService = withdrawalService;
    }
    
    [Authorize(Policy = JwtExtensions.CustomerOrOwnerPolicy)]
    [HttpPost("WithdrawalRequest")]
    public async Task<IActionResult> CreateWithdrawalRequest(Request.CreateWithdrawalRequest request)
    {
        var result = await _withdrawalService.CreateWithdrawalRequest(request);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success invite withdrawal", HttpContext.TraceIdentifier));
    }
    
    [Authorize(Policy = JwtExtensions.AdminPolicy)]
    [HttpGet("AdminGetWithdrawalRequest")]
    public async Task<IActionResult> AdminGetWithdrawalRequest([FromQuery] Request.GetWithdrawalRequest request, 
        Service.Base.Request.Pagination pagination)
    {
        var result = await _withdrawalService.AdminGetWithdrawalRequest(request, pagination);
        return Ok(ApiResponseFactory.SuccessResponse(result, "Success get all withdrawal", HttpContext.TraceIdentifier));
    }
    
    // [Authorize(Policy = JwtExtensions.AdminPolicy)]
    // [HttpPost("AdminAcceptWithdrawalRequest")]
    // public async Task<IActionResult> AdminAcceptWithdrawalRequest(Request.CreateWithdrawalRequest request)
    // {
    //     var result = await _withdrawalService.AdminAcceptWithdrawalRequest(request);
    //     return Ok(ApiResponseFactory.SuccessResponse(result, "Success invite withdrawal", HttpContext.TraceIdentifier));
    // }
}
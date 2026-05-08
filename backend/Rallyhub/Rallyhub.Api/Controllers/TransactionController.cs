using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rallyhub.Api.Extention;
using Rallyhub.Service.Models;
using Rallyhub.Service.Transaction;

namespace Rallyhub.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TransactionController : ControllerBase
{
    private readonly IService _transactionService;
    public TransactionController(IService transactionService)
    {
        _transactionService = transactionService;
    }
    
    [HttpGet("GetTransaction")]
    [Authorize(Policy = JwtExtensions.CustomerOrOwnerPolicy)]
    public async Task<IActionResult> GetTransactionResponse([FromBody] Service.Base.Request.PagingDay paginDay)
    {
        await _transactionService.GetTransactionResponse(paginDay);
        return Ok(ApiResponseFactory.SuccessResponse( "Success","Success" 
            , HttpContext.TraceIdentifier));
    }
    
    [HttpGet("AdminGetTransaction")]
    [Authorize(Policy = JwtExtensions.AdminPolicy)]
    public async Task<IActionResult> AdminGetTransactionResponse([FromBody] Guid? userId ,Service.Base.Request.PagingDay paginDay)
    {

        await _transactionService.AdminGetTransactionResponse(userId, paginDay);
        return Ok(ApiResponseFactory.SuccessResponse( "Success","Success" 
            , HttpContext.TraceIdentifier));
    }
}
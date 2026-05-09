using Microsoft.AspNetCore.Mvc;
using Rallyhub.Service.Models;
using Rallyhub.Service.SepayService;

namespace Rallyhub.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SepayController : ControllerBase
{
    private readonly IService _sepayService;

    public SepayController(IService sepayService)
    {
        _sepayService = sepayService;
    }
    
    [HttpPost("SepayWebhookHandler")]
    public async Task<IActionResult> BookingSepayWebhookHandler([FromBody] Request.SepayWebhookRequest request)
    {
        await _sepayService.BookingSepayWebhookHandler(request);
        return Ok(ApiResponseFactory.SuccessResponse( "Success","Success" 
            , HttpContext.TraceIdentifier));
    }
}
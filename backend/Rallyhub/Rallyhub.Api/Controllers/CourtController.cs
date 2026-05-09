using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rallyhub.Api.Extention;
using Rallyhub.Service.Court;
using Rallyhub.Service.Models;

namespace Rallyhub.Api.Controllers;

//[ApiController]
//[Authorize(Policy = JwtExtensions.CustomerPolicy)]
[Route("[controller]")]
public class CourtController: ControllerBase
{
    private readonly IService _courtService;

    public CourtController(IService courtService)
    {
        _courtService = courtService;
    }

    [HttpGet("CustomerSearchCourtByFilters")]
    public async Task<IActionResult> GetCourtsByFilter([FromQuery] Request.SearchByFilterRequest request)
    {
        var result = await _courtService.SearchByFilter(request);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
    
    [HttpGet("CustomerGetCourtDetailsById{courtId}")]
    public async Task<IActionResult> GetCourtsById(Guid courtId)
    {
        var result = await _courtService.GetCourtsDetailById(courtId);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
    
    [HttpGet("CustomerGetSubCourtByCourtId{courtId}")]
    public async Task<IActionResult> GetSubCourt(Guid courtId)
    {
        var result = await _courtService.GetSubCourtById(courtId);
        return Ok(ApiResponseFactory.SuccessResponse( result,"Success" 
            , HttpContext.TraceIdentifier));
    }
}
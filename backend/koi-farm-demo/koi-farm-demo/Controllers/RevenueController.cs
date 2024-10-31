using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private readonly RevenueService _revenueService;

        public RevenueController(RevenueService revenueService)
        {
            _revenueService = revenueService;
        }

        [HttpGet("total")]
        public async Task<IActionResult> GetTotalRevenue([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var revenue = await _revenueService.CalculateRevenueAsync(startDate, endDate);
                return Ok(new { TotalRevenue = revenue });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;
        private readonly IOrderService _orderService;

        public RevenueController(IRevenueService revenueService, IOrderService orderService)
        {
            _revenueService = revenueService;
            _orderService = orderService;
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
        [HttpGet("transaction-history")]
        [Authorize]
        public async Task<IActionResult> GetTransactionHistory()
        {
            try
            {
                var transactionHistory = await _orderService.GetTransactionHistoryAsync();

                if (!transactionHistory.Any())
                {
                    return NotFound("No transaction history found.");
                }

                return Ok(transactionHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}

using System.Security.Claims;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoyaltyPointController : ControllerBase
    {
        private readonly ILoyaltyPointService _loyaltyPointService;
        private readonly ICustomerService _customerService;
        public LoyaltyPointController(ILoyaltyPointService loyaltyPointService, ICustomerService customerService)
        {
            _loyaltyPointService = loyaltyPointService;
            _customerService = customerService;
        }

        [HttpPost("award")]
        public async Task<IActionResult> AwardPoints(int customerId, decimal orderAmount)
        {
            try
            {
                await _loyaltyPointService.AwardPointsAsync(customerId, orderAmount);
                return Ok("Points awarded successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("redeem")]
        public async Task<IActionResult> RedeemPoints(int customerId, int pointsToRedeem)
        {
            try
            {
                var success = await _loyaltyPointService.RedeemPointsAsync(customerId, pointsToRedeem);
                if (!success)
                    return BadRequest("Insufficient points");

                return Ok("Points redeemed successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetPointHistory()
        {
            // Lấy userId từ claim
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;
            

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }
            var customer = await _customerService.GetCustomerByUserIdAsync(userId);

            try
            {
                var history = await _loyaltyPointService.GetLoyaltyPointHistoryAsync(customer.CustomerId);
                if (!history.Any())
                {
                    return NotFound("No loyalty point history found.");
                }
                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}

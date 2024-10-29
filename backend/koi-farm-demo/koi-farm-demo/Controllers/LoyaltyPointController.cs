﻿using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoyaltyPointController : ControllerBase
    {
        private readonly ILoyaltyPointService _loyaltyPointService;

        public LoyaltyPointController(ILoyaltyPointService loyaltyPointService)
        {
            _loyaltyPointService = loyaltyPointService;
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
    }
}
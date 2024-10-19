using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using koi_farm_demo.Data;

namespace koi_farm_demo.Controllers
{
    [Route("api/ratings")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpPost("rate-fish")]
        [Authorize]
        public async Task<IActionResult> RateFish([FromBody] RateFishDto rateFishDto)
        {
            // Lấy userId từ claim
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;
            if (!int.TryParse(userIdClaim, out int customerId))
            {
                return BadRequest("Invalid user ID.");
            }

            try
            {
                await _ratingService.AddRatingAsync(customerId, rateFishDto.FishId, rateFishDto.RatingValue, rateFishDto.Comment);
                return Ok("Đánh giá thành công!");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("fish/{fishId}/")]
        public async Task<IActionResult> GetRatingsForFish(int fishId)
        {
            var ratings = await _ratingService.GetRatingsForFishAsync(fishId);

            if (!ratings.Any())
            {
                return NotFound("Không có đánh giá nào cho con cá này.");
            }

            return Ok(ratings);
        }
    }
}

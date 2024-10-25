using koi_farm_demo.Models;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FishCareController : ControllerBase
    {
        private readonly IFishCareService _fishCareService;

        public FishCareController(IFishCareService fishCareService)
        {
            _fishCareService = fishCareService;
        }

        [HttpPost]
        public async Task<IActionResult> AddFishCare(FishCare fishCare)
        {
            if (fishCare == null)
            {
                return BadRequest("FishCare data is null.");
            }

            var createdFishCare = await _fishCareService.AddFishCareAsync(fishCare);

            return CreatedAtAction(nameof(AddFishCare), new { id = createdFishCare.FishCareId }, createdFishCare);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FishCare>>> GetAllFishCare()
        {
            var fishCares = await _fishCareService.GetAllFishCareAsync();
            return Ok(fishCares);
        }

        // Lấy FishCare theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<FishCare>> GetFishCareById(int id)
        {
            var fishCare = await _fishCareService.GetFishCareByIdAsync(id);
            if (fishCare == null)
            {
                return NotFound();
            }
            return Ok(fishCare);
        }

        // Cập nhật FishCare
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFishCare(int id, [FromBody] FishCare fishCare)
        {
            if (fishCare == null || fishCare.FishCareId != id)
            {
                return BadRequest("Invalid FishCare data.");
            }

            var updatedFishCare = await _fishCareService.UpdateFishCareAsync(fishCare);
            if (updatedFishCare == null)
            {
                return NotFound();
            }

            return Ok(updatedFishCare);
        }
        [HttpPatch("{id}/status-details")]
        public async Task<IActionResult> UpdateFishCareStatusAndDetails(int id, [FromBody] UpdateHealth updatedData)
        {
            if (updatedData == null)
            {
                return BadRequest("Invalid data.");
            }

            var result = await _fishCareService.UpdateFishCareStatusAndDetailsAsync(id, updatedData.HealthStatus, updatedData.CareDetails);
            if (result == null)
            {
                return NotFound("FishCare not found.");
            }

            return Ok(result);
        }
    }
}

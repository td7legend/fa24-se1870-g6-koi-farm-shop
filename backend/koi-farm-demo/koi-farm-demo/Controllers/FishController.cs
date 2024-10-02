using koi_farm_demo.Data;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FishController : ControllerBase
    {
        private readonly IFishService _fishService;

        public FishController(IFishService fishService)
        {
            _fishService = fishService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fish>>> GetFish()
        {
            var fish = await _fishService.GetAllFishAsync();
            return Ok(fish);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Fish>> GetFish(int id)
        {
            var fish = await _fishService.GetFishByIdAsync(id);
            if (fish == null)
            {
                return NotFound();
            }
            return Ok(fish);
        }

        [HttpPost]
        public async Task<ActionResult<Fish>> PostFish(FishCreateDto fishCreateDto)
        {
            await _fishService.AddFishAsync(fishCreateDto);
            return CreatedAtAction(nameof(GetFish), new { id = fishCreateDto.Name }, fishCreateDto); // Cần điều chỉnh lại để trả về đối tượng Fish đúng
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFish(int id)
        {
            await _fishService.DeleteFishAsync(id);
            return NoContent();
        }
        [HttpPatch("{id}/quantity")]
        public async Task<IActionResult> UpdateQuantity(int id, int quantity)
        {
            var fish = await _fishService.GetFishByIdAsync(id);
            if (fish == null)
            {
                return NotFound();
            }

            // Gọi service để cập nhật Quantity
            await _fishService.UpdateFishQuantityAsync(id, quantity);

            return NoContent();
        }

    }
}

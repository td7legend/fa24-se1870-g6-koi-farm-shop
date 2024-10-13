using koi_farm_demo.Data;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/fishs")]
    public class FishController : ControllerBase
    {
        private readonly IFishService _fishService;

        public FishController(IFishService fishService)
        {
            _fishService = fishService;
        }

        [HttpGet]
        [SwaggerOperation(Summary = "Retrieve all fish in the system")]

        public async Task<ActionResult<IEnumerable<Fish>>> GetAll()
        {
            var fish = await _fishService.GetAllFishAsync();
            return Ok(fish);
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Retrieve a fish by its ID")]

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
        [SwaggerOperation(Summary = "Retrieve a fish by its ID")]

        public async Task<ActionResult<Fish>> AddFish(FishCreateDto fishCreateDto)
        {
            await _fishService.AddFishAsync(fishCreateDto);
            return CreatedAtAction(nameof(GetFish), new { id = fishCreateDto.Name }, fishCreateDto); // Có thể điều chỉnh để trả về đối tượng Fish phù hợp.
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Delete a fish by its ID")]
        public async Task<IActionResult> DeleteFish(int id)
        {
            await _fishService.DeleteFishAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/quantity")]
        [SwaggerOperation(Summary = "Update the quantity of a specific fish")]

        public async Task<IActionResult> UpdateQuantity(int id, int quantity)
        {
            var fish = await _fishService.GetFishByIdAsync(id);
            if (fish == null)
            {
                return NotFound();
            }

            await _fishService.UpdateFishQuantityAsync(id, quantity);
            return NoContent();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using koi_farm_demo.Services;
using koi_farm_demo.Data;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FishTypeController : ControllerBase
    {
        private readonly IFishTypeService _fishTypeService;

        public FishTypeController(IFishTypeService fishTypeService)
        {
            _fishTypeService = fishTypeService;
        }
        [HttpGet("getall")] 
        public async Task<ActionResult<IEnumerable<FishType>>> GetAll()
        {
            var fishTypes = await _fishTypeService.GetAllFishTypesAsync(); 
            return Ok(fishTypes); 
        }

        
        [HttpPost("AddFishType")]
        public async Task<IActionResult> PostFishType([FromBody] FishTypeCreateDto fishTypeCreateDto) 
        {
            if (fishTypeCreateDto == null)
            {
                return BadRequest("Invalid data.");
            }

            var result = await _fishTypeService.AddFishTypeAsync(fishTypeCreateDto);

            if (result)
            {
                return CreatedAtAction(nameof(PostFishType), new { name = fishTypeCreateDto.Name });
            }

            return BadRequest("Failed to add fish type.");
        }

    }
}

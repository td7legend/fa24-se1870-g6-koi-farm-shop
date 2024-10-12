using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using koi_farm_demo.Services;
using koi_farm_demo.Data;
using Swashbuckle.AspNetCore.Annotations;

namespace koi_farm_demo.Controllers
{
    [Route("api/fishtypes")]
    [ApiController]
    public class FishTypeController : ControllerBase
    {
        private readonly IFishTypeService _fishTypeService;

        public FishTypeController(IFishTypeService fishTypeService)
        {
            _fishTypeService = fishTypeService;
        }

        [HttpGet]
        [SwaggerOperation(Summary = "Retrieve all fish types")]

        public async Task<ActionResult<IEnumerable<FishType>>> GetAll()
        {
            var fishTypes = await _fishTypeService.GetAllFishTypesAsync();
            return Ok(fishTypes);
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Add a new fish type")]
        public async Task<IActionResult> AddFishType([FromBody] FishTypeCreateDto fishTypeCreateDto)
        {
            if (fishTypeCreateDto == null)
            {
                return BadRequest("Invalid data.");
            }

            var result = await _fishTypeService.AddFishTypeAsync(fishTypeCreateDto);

            if (result)
            {
                return CreatedAtAction(nameof(AddFishType), new { name = fishTypeCreateDto.Name });
            }

            return BadRequest("Failed to add fish type.");
        }
    }
}

using koi_farm_demo.Data;
using koi_farm_demo.Models;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
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
        private readonly ICertificateService _certificateService;

        public FishController(IFishService fishService, ICertificateService certificateService)
        {
            _fishService = fishService;
            _certificateService = certificateService;
        }
        [AllowAnonymous]
        [HttpGet]
        [SwaggerOperation(Summary = "Retrieve all fish in the system")]

        public async Task<ActionResult<IEnumerable<Fish>>> GetAll()
        {
            var fish = await _fishService.GetAllFishAsync();
            return Ok(fish);
        }
        [AllowAnonymous]
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
        [SwaggerOperation(Summary = "Add a fish")]

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
        [HttpGet("images/{fishId}")]
        public async Task<ActionResult<IEnumerable<FishImage>>> GetFishImages(int fishId)
        {
            var fishImages = await _fishService.GetFishImagesByFishIdAsync(fishId);

            if (fishImages == null || !fishImages.Any())
                return NotFound("No images found for this fish.");

            return Ok(fishImages);
        }
        [HttpGet("certificates/{fishId}")]
        public async Task<ActionResult<IEnumerable<CertificateDto>>> GetFishCertificate(int fishId)
        {
            var fishCertificate = await _certificateService.GetCertificatesByFishIdAsync(fishId);

            if (fishCertificate == null || !fishCertificate.Any())
                return NotFound("No images found for this fish.");

            return Ok(fishCertificate);
        }
    }
}

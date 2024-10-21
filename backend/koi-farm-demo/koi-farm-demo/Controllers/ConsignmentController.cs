using koi_farm_demo.Models;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsignmentController : ControllerBase
    {
        private readonly IConsignmentService _consignmentService;

        public ConsignmentController(IConsignmentService consignmentService)
        {
            _consignmentService = consignmentService;
        }

        [HttpPost("sale")]
        public async Task<IActionResult> CreateSaleConsignment([FromBody] CreateConsignmentRequest request)
        {
            var consignment = await _consignmentService.CreateSaleConsignmentAsync(request);
            return Ok(consignment);
        }

        [HttpPost("care")]
        public async Task<IActionResult> CreateCareConsignment([FromBody] CreateCareConsignmentRequest request)
        {
            var consignment = await _consignmentService.CreateCareConsignmentAsync(request);
            return Ok(consignment);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateConsignmentStatus(int id, [FromBody] UpdateConsignmentStatusRequest request)
        {
            await _consignmentService.UpdateConsignmentStatusAsync(id, request.Status);
            return Ok();
        }

        [HttpPost("{id}/receive-sale")]
        public async Task<IActionResult> ReceiveConsignmentForSale(int id)
        {
            await _consignmentService.ReceiveConsignmentForSaleAsync(id);
            return Ok();
        }

        [HttpPost("{id}/receive-care")]
        public async Task<IActionResult> ReceiveConsignmentForCare(int id)
        {
            await _consignmentService.ReceiveConsignmentForCareAsync(id);
            return Ok();
        }
        [HttpPut("{consignmentId}/update-carefee-status")]
        public async Task<IActionResult> UpdateCareFeeAndStatus(int consignmentId, [FromBody] UpdateConsignmentRequest request)
        {
            try
            {
                await _consignmentService.UpdateCareFeeAndStatusAsync(consignmentId, request.NewCareFee, request.NewStatus);
                return Ok(new { message = "CareFee and Status updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
    public class UpdateConsignmentStatusRequest
    {
        public ConsignmentStatus Status { get; set; }
    }
    public class UpdateConsignmentRequest
    {
        public decimal NewCareFee { get; set; }
        public ConsignmentStatus NewStatus { get; set; }
    }
}

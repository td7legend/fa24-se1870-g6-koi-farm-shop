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
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetConsignmentsByCustomerId(int customerId)
        {
            var consignments = await _consignmentService.GetConsignmentsByCustomerIdAsync(customerId);
            return Ok(consignments);
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
        public async Task<IActionResult> ReceiveConsignmentForSale(int id, [FromQuery] decimal agreePrice)
        {
            await _consignmentService.ReceiveConsignmentForSaleAsync(id, agreePrice);
            return Ok();
        }

        [HttpPost("{id}/receive-care")]
        public async Task<IActionResult> ReceiveConsignmentForCare(int id, [FromQuery] decimal careFee)
        {
            await _consignmentService.ReceiveConsignmentForCareAsync(id, careFee);
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
        [HttpPut("{id}/update-sale")]
        public async Task<IActionResult> UpdateConsignmentForSale(int id, [FromQuery] decimal agreePrice, [FromBody] List<ConsignmentLine> updatedConsignmentLines)
        {
            await _consignmentService.UpdateConsignmentForSaleAsync(id, agreePrice, updatedConsignmentLines);
            return Ok("Consignment updated for sale successfully.");
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllConsignment()
        {
            var consignments = await _consignmentService.GetAllConsignmentAsync();
            return Ok(consignments);
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

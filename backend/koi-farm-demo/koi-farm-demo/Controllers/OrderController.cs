using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("getByID/{orderId}")]
        public async Task<ActionResult<Order>> GetOrder(int orderId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost("addToCart/{orderId}")]
        public async Task<IActionResult> AddOrderLine(int orderId, OrderLineCreateDTO orderLineCreateDto)
        {
            await _orderService.AddOrderLineAsync(orderId, orderLineCreateDto);
            return Ok();
        }

        [HttpDelete("delete/{orderId}/{fishId}")]
        public async Task<IActionResult> RemoveOrderLine(int orderId, int fishId)
        {
            await _orderService.RemoveOrderLineAsync(orderId, fishId);
            return NoContent();
        }

        [HttpPost("pay/{orderId}")]
        public async Task<IActionResult> PayForOrder(int orderId)
        {
            await _orderService.PayForOrderAsync(orderId);
            return Ok();
        }
    }
}

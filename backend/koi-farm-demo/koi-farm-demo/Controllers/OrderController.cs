using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }


        [HttpGet("{orderId}")]
        [SwaggerOperation(Summary = "Retrieve an order by ID")]

        public async Task<ActionResult<Order>> GetOrder(int orderId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost("{orderId}/orderlines")]
        [SwaggerOperation(Summary = "Add an item to an existing order")]
        public async Task<IActionResult> AddOrderLine(int orderId, OrderLineCreateDTO orderLineCreateDto)
        {
            await _orderService.AddOrderLineAsync(orderId, orderLineCreateDto);
            return Ok();
        }

        [HttpDelete("{orderId}/orderlines/{fishId}")]
        [SwaggerOperation(Summary = "Remove an item from an existing order")]
        public async Task<IActionResult> RemoveOrderLine(int orderId, int fishId)
        {
            await _orderService.RemoveOrderLineAsync(orderId, fishId);
            return NoContent();
        }

        [HttpPost("{orderId}/pay")]
        [SwaggerOperation(Summary = "Process payment for an order")]
        public async Task<IActionResult> PayForOrder(int orderId)
        {
            await _orderService.PayForOrderAsync(orderId);
            return Ok();
        }
        [HttpGet("customer/{customerId}/in-cart")]
        [SwaggerOperation(Summary = "Retrieve all in-cart orders for a customer")]
        public async Task<ActionResult<List<OrderDTO>>> GetInCartOrders(int customerId)
        {
            var orders = await _orderService.GetOrdersInCartByCustomerIdAsync(customerId);
            if (orders == null || !orders.Any())
            {
                return NotFound();
            }
            return Ok(orders);
        }
        [HttpPost("customer/{customerId}/add-to-cart")]
        [SwaggerOperation(Summary = "Retrieve an order history by customerID")]
        public async Task<IActionResult> AddItemToCart(int customerId, OrderLineCreateDTO orderLineCreateDto)
        {
            await _orderService.AddItemToCart(customerId, orderLineCreateDto);
            return Ok();
        }
        [HttpGet("order-history/{customerId}")]
        [SwaggerOperation(Summary = "Add an item to the customer's cart")]
        public async Task<IActionResult> GetOrderHistory(int customerId)
        {
            var orders = await _orderService.GetOrderHistory(customerId);

            if (orders == null || orders.Count == 0)
            {
                return NotFound("No order history found for this customer.");
            }

            return Ok(orders);
        }
    }
}

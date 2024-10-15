using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ICustomerService _customerService;
        public OrderController(IOrderService orderService, ICustomerService customerService)
        {
            _orderService = orderService;
            _customerService = customerService;
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
        [HttpGet("order-history")]
        [Authorize]
        [SwaggerOperation(Summary = "Get the customer's order history")]
        public async Task<IActionResult> GetOrderHistory()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            var customer = await _customerService.GetCustomerByUserIdAsync(userId);
            if (customer == null)
            {
                return NotFound("Customer not found.");
            }
            var orders = await _orderService.GetOrderHistory(customer.CustomerId);

            if (orders == null || orders.Count == 0)
            {
                return NotFound("No order history found for this customer.");
            }

            return Ok(orders);
        }

    }
}

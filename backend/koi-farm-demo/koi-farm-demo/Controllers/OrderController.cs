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
        [HttpPost("pay")]
        [SwaggerOperation(Summary = "Process payment for an order")]
        public async Task<IActionResult> PayForOrder([FromBody] OrderDTO orderDto)
        {
            if (orderDto == null || orderDto.OrderLines == null || orderDto.OrderLines.Count == 0)
            {
                return BadRequest("Invalid order data.");
            }

            try
            {
                await _orderService.PayForOrderAsync(orderDto.OrderId, orderDto);

                return Ok("Payment processed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPatch("{orderId}/status")]
        [Authorize]
        [SwaggerOperation(Summary = "Update the status of an order")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderStatus status)
        {
            if (status == null)
            {
                return BadRequest("Invalid status data.");
            }

            try
            {
                await _orderService.UpdateOrderStatusAsync(orderId, status);
                return Ok("Order status updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet]
        [SwaggerOperation(Summary = "Retrieve all orders in the system with status other than InCart")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersWithStatusAsync();
                if (orders == null || !orders.Any())
                {
                    return NotFound("No orders found.");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

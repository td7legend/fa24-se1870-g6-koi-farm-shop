using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace koi_farm_demo.Controllers
{
    [Route("api/carts")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ICustomerService _customerService;
        public CartController(IOrderService orderService, ICustomerService customerService)
        {
            _orderService = orderService;
            _customerService = customerService;
        }
        [HttpGet]
        [SwaggerOperation(Summary = "Retrieve all in-cart orders for a customer")]
        public async Task<ActionResult<List<OrderDTO>>> GetInCartOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            // Lấy CustomerId dựa trên UserId
            var customer = await _customerService.GetCustomerByUserIdAsync(userId);
            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            var orders = await _orderService.GetOrdersInCartByCustomerIdAsync(customer.CustomerId);
            if (orders == null || !orders.Any())
            {
                return NotFound();
            }
            return Ok(orders);
        }
        [HttpPost]
        [SwaggerOperation(Summary = "Add an item to the cart for a customer")]
        public async Task<IActionResult> AddItemToCart(OrderLineCreateDTO orderLineCreateDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            // Lấy CustomerId dựa trên UserId
            var customer = await _customerService.GetCustomerByUserIdAsync(userId);
            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            await _orderService.AddItemToCart(customer.CustomerId, orderLineCreateDto);
            return Ok();
        }
        [HttpPatch]
        public async Task<IActionResult> UpdateCart(UpdateCartDTO updateCartDTO)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;
            if(ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            var customer = await _customerService.GetCustomerByUserIdAsync(userId);
            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            await _orderService.UpdateCartAsync(customer.CustomerId, updateCartDTO);
            return Ok();
        }


    }
}


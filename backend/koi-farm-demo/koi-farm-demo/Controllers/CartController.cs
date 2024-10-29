using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace koi_farm_demo.Controllers
{
    [Route("api")]
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
        [HttpGet("cart")]
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
        [HttpPost("carts")]
        [SwaggerOperation(Summary = "Add an item to the cart for a customer")]
        public async Task<IActionResult> AddItemToCart(OrderLineCreateDTO orderLineCreateDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new
                {
                    ErrorCode = "InvalidUserID",
                    Message = "User ID không hợp lệ.",
                    Detail = "Không thể phân tích user ID từ token xác thực."
                });
            }

            var customer = await _customerService.GetCustomerByUserIdAsync(userId);
            if (customer == null)
            {
                return NotFound(new
                {
                    ErrorCode = "CustomerNotFound",
                    Message = "Không tìm thấy thông tin khách hàng.",
                    Detail = "User ID không tương ứng với bất kỳ khách hàng nào."
                });
            }

            try
            {
                await _orderService.AddItemToCart(customer.CustomerId, orderLineCreateDto);
                return Ok("Sản phẩm đã được thêm vào giỏ hàng thành công.");
            }
            catch (Exception ex) when (ex.Message.Contains("Fish not available"))
            {
                return BadRequest(new
                {
                    ErrorCode = "FishUnavailable",
                    Message = "Sản phẩm này hiện không có sẵn.",
                    Detail = ex.Message
                });
            }
            catch (Exception ex) when (ex.Message.Contains("insufficient quantity"))
            {
                return BadRequest(new
                {
                    ErrorCode = "InsufficientQuantity",
                    Message = "Số lượng cá không đủ trong kho.",
                    Detail = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    ErrorCode = "InternalError",
                    Message = "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
                    Detail = ex.Message
                });
            }
        }


        [HttpPatch("carts")]
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


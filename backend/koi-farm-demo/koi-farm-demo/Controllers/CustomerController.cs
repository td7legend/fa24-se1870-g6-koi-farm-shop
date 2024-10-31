using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;
        public CustomerController(ICustomerService customerService, IOrderService orderService, IUserService userService)
        {
            _customerService = customerService;
            _orderService = orderService;
            _userService = userService;
        }

        [HttpGet("my-info")]
        [Authorize]
        public async Task<IActionResult> GetMyInfo()
        {
            // Lấy UserId từ claim
            var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }
            var email = await _userService.GetEmailByUserIdAsync(userId);
            // Lấy Customer dựa trên UserId
            var customer = await _customerService.GetCustomerByUserIdAsync(userId);

            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            // Tạo DTO chứa thông tin customer và email
            var customerInfoDto = new CustomerInfoDto
            {
                CustomerId = customer.CustomerId,
                FullName = customer.FullName,
                Address = customer.Address,
                PhoneNumber = customer.PhoneNumber,
                Tier = customer.Tier,
                PointAvailable = customer.PointAvailable,
                UsedPoint = customer.UsedPoint,
                AccommodatePoint = customer.AccommodatePoint,
                Email = email // Lấy email từ User
            };

            return Ok(customerInfoDto);
        }

        [HttpGet]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);
        }

        [HttpPut("my-info")]
        [Authorize]
        public async Task<IActionResult> UpdateMyInfo(UpdateCustomerDto updateCustomerDto)
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

            customer.FullName = updateCustomerDto.Name;
            customer.PhoneNumber = updateCustomerDto.Phone;
            customer.Address = updateCustomerDto.Address;

            await _customerService.UpdateCustomerAsync(customer);

            return NoContent();
        }

        [HttpDelete("{customerId}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteCustomer(int customerId)
        {
            await _customerService.DeleteCustomerAsync(customerId);
            return NoContent();
        }
    }
}

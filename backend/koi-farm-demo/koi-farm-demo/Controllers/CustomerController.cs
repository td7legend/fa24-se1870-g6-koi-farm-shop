using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace koi_farm_demo.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
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

            // Lấy Customer dựa trên UserId
            var customer = await _customerService.GetCustomerByUserIdAsync(userId);

            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            return Ok(customer);
        }

        [HttpGet]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);
        }

        // Cập nhật thông tin khách hàng
        [HttpPut("{customerId}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateCustomer(int customerId, Customer customer)
        {
            if (customerId != customer.CustomerId)
            {
                return BadRequest("Customer ID mismatch.");
            }

            await _customerService.UpdateCustomerAsync(customer);
            return NoContent();
        }

        // Xóa khách hàng (chỉ cho Manager)
        [HttpDelete("{customerId}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteCustomer(int customerId)
        {
            await _customerService.DeleteCustomerAsync(customerId);
            return NoContent();
        }
    }
}

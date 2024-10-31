using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using System.Threading.Tasks;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using System.IO;
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
        [HttpGet("export-invoice/{orderId}")]
        public async Task<IActionResult> ExportInvoice(int orderId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            using (var memoryStream = new MemoryStream())
            {
                // Khởi tạo tài liệu PDF
                var writer = new PdfWriter(memoryStream);
                var pdf = new PdfDocument(writer);
                var document = new Document(pdf);

                // Thêm tiêu đề hóa đơn
                document.Add(new Paragraph("Golden Koi Shop")
            .SetTextAlignment(TextAlignment.CENTER)
            .SetFontSize(24)
            .SetBold());

                // Thêm thông tin liên hệ (có thể điều chỉnh theo thông tin của bạn)
                document.Add(new Paragraph("Address: 123 ABC Street, Ho Chi Minh City")
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontSize(12));
                document.Add(new Paragraph("Phone: 0123 456 789")
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontSize(12));
                document.Add(new Paragraph("Email: contact@goldenkoi.com")
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontSize(12));

                // Thêm khoảng cách giữa phần thông tin cửa hàng và tiêu đề hóa đơn
                document.Add(new Paragraph("\n"));

                // Thêm tiêu đề hóa đơn
                document.Add(new Paragraph("INVOICE")
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontSize(20)
                    .SetBold());

                // Thêm thông tin đơn hàng
                document.Add(new Paragraph($"Order ID: {order.OrderId}"));
                document.Add(new Paragraph($"Date: {order.OrderDate:dd-MM-yyyy}"));
                document.Add(new Paragraph($"Customer: {order.CustomerId}"));
                document.Add(new Paragraph($"Email: {order.Address}"));

                // Thêm bảng hiển thị thông tin sản phẩm
                var table = new iText.Layout.Element.Table(5).SetWidth(UnitValue.CreatePercentValue(100));
                table.AddHeaderCell("Fish ID");
                table.AddHeaderCell("Fish Name");
                table.AddHeaderCell("Quantity");
                table.AddHeaderCell("Unit Price (VND)");
                table.AddHeaderCell("Total Price (VND)");

                foreach (var line in order.OrderLines)
                {
                    table.AddCell(line.FishId.ToString());
                    table.AddCell(line.FishName); // Tên sản phẩm
                    table.AddCell(line.Quantity.ToString());
                    table.AddCell($"{line.UnitPrice:N0} VND"); // Định dạng giá
                    table.AddCell($"{line.TotalPrice:N0} VND"); // Định dạng giá
                }

                document.Add(table);

                // Tổng cộng
                document.Add(new Paragraph($"Total Amount: {order.TotalAmount:N0} VND")
                    .SetTextAlignment(TextAlignment.RIGHT)
                    .SetBold());

                document.Close();

                // Trả file PDF về cho client
                return File(memoryStream.ToArray(), "application/pdf", $"Invoice_Order_{orderId}.pdf");
            }
        }

    
}
}
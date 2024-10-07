using koi_farm_demo.Models;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [HttpPost]
        public IActionResult CreatePaymentUrl(PaymentInformationModel model)
        {
            if (model == null)
            {
                return BadRequest("Model không hợp lệ.");
            }

            try
            {
                var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
                return Ok(new { paymentUrl = url }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        [HttpGet("callback")]
        public IActionResult PaymentCallback()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);
                return new JsonResult(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi trong quá trình callback thanh toán.");
            }
        }
    }
}

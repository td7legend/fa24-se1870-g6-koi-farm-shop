using koi_farm_demo.Models;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;

namespace koi_farm_demo.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Create a VNPay payment URL")]
        public IActionResult CreatePaymentUrl(PaymentInformationModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid payment information.");
            }

            try
            {
                var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
                return Ok(new { paymentUrl = url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("callback")]
        [SwaggerOperation(Summary = "Handle VNPay payment callback")]
        public IActionResult PaymentCallback()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);
                return new JsonResult(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred during payment callback.");
            }
        }
    }
}

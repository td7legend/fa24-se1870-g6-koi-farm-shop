//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace koi_farm_demo.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class StaffController : ControllerBase
//    {
//        private readonly IStaffService _staffService;

//        public StaffController(IStaffService staffService)
//        {
//            _staffService = staffService;
//        }

//        [HttpGet("all")]
//        public async Task<IActionResult> GetAllStaff()
//        {
//            try
//            {
//                var staffs = await _staffService.GetAllStaffAsync();
//                return Ok(staffs);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetStaffById(int id)
//        {
//            try
//            {
//                var staff = await _staffService.GetStaffByIdAsync(id);
//                return Ok(staff);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

       

//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffModel model)
//        {
//            try
//            {
//                await _staffService.UpdateStaffAsync(id, model);
//                return Ok();
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteStaff(int id)
//        {
//            try
//            {
//                await _staffService.DeleteStaffAsync(id);
//                return Ok();
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }
//    }
//}

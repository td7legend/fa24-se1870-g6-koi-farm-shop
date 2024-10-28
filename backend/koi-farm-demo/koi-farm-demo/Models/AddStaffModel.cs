namespace koi_farm_demo.Models
{
    public class AddStaffModel
    {
        
            public string FullName { get; set; }
            public string PhoneNumber { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } // Vai trò của nhân viên (ví dụ: Nhân viên bán hàng, Quản lý kho, v.v.)
        

    }
}


# Golden Koi

![Golden Koi Logo](https://firebasestorage.googleapis.com/v0/b/move-management-4fb2c.appspot.com/o/379128395d441b9667fb5156f1bbc970.png?alt=media&token=bb8dc2b6-2551-46e3-bf68-903798945e0d)

## Giới thiệu

Golden Koi là một nền tảng trực tuyến dành cho việc mua bán cá koi, mang đến trải nghiệm người dùng tuyệt vời với thiết kế hiện đại và giao diện thân thiện. Ứng dụng được xây dựng bằng **ReactJS**, **ASP.NET Web API**, và **SQL SERVER** để đảm bảo hiệu suất cao và khả năng mở rộng.

## Công nghệ sử dụng

- **Frontend**: <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"  width="20"  height="20">
- **Backend**: <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/C_Sharp_wordmark.svg/1024px-C_Sharp_wordmark.svg.png"  width="20"  height="20">
- **Cơ sở dữ liệu**: <img  src="https://www.vhv.rs/dpng/d/79-799586_microsoft-sql-server-logo-hd-png-download.png"  width="20"  height="20">
- **Deployment**: https://fa24-se1870-g6-koi-farm-shop.vercel.app

## Tính năng

- **Đăng ký và đăng nhập người dùng**: Cho phép người dùng tạo tài khoản và đăng nhập để quản lý đơn hàng.
- **Quản lý sản phẩm**: Người dùng có thể xem và tìm kiếm các loại cá koi.
- **Giỏ hàng**: Người dùng có thể thêm sản phẩm vào giỏ hàng và thực hiện thanh toán.
- **Quản lý đơn hàng**: Người dùng có thể theo dõi tình trạng đơn hàng của mình.
- **Firebase**: Cấu hình Firebase cho việc lưu trữ ảnh.
- **Google OAuth**: Cấu hình API Google cho đăng nhập.
- **VNPay**: Cấu hình API VNPay cho thanh toán.
- **Bảo mật API**: JWT
## Testing
- Trong dự án Golden Koi, chúng tôi sử dụng xUnit để thực hiện unit testing cho các thành phần của hệ thống, đặc biệt là các API được xây dựng trong backend. Việc kiểm thử giúp đảm bảo rằng tất cả các phần của ứng dụng hoạt động đúng đắn và ổn định. Để thực hiện unit tests hiệu quả và kiểm tra tính chính xác của các API, chúng tôi sử dụng mocking để giả lập các thành phần bên ngoài và tránh phụ thuộc vào các dịch vụ hoặc tài nguyên thực tế như cơ sở dữ liệu hoặc các dịch vụ bên thứ ba.

**xUnit**

xUnit là một framework kiểm thử phổ biến cho .NET, cung cấp một cách tiếp cận rõ ràng và dễ sử dụng để kiểm tra các đơn vị mã nguồn trong ứng dụng. Các bài kiểm thử được viết trong xUnit cho phép xác minh rằng mã nguồn thực thi chính xác như mong đợi, từ đó giúp phát hiện các lỗi tiềm ẩn ngay trong quá trình phát triển.

**Mocking**

Trong khi kiểm thử các API hoặc các thành phần trong ứng dụng, chúng tôi sử dụng mocking để tạo các đối tượng giả lập thay vì phụ thuộc vào các dịch vụ hoặc thành phần ngoài như cơ sở dữ liệu, API bên ngoài, hoặc các dịch vụ mạng. Việc này giúp giảm thiểu sự phụ thuộc vào các yếu tố bên ngoài trong quá trình kiểm thử, giúp các kiểm thử trở nên nhanh chóng, ổn định và dễ kiểm soát hơn.

Các thư viện mocking phổ biến mà chúng tôi sử dụng trong dự án bao gồm:
- Moq: Đây là một thư viện phổ biến cho .NET giúp tạo mock objects một cách dễ dàng. Bằng cách sử dụng Moq, chúng tôi có thể giả lập các hành vi của các lớp hoặc interface bên ngoài, từ đó chỉ kiểm thử mã nguồn của ứng dụng mà không phải lo lắng về các yếu tố ngoài như cơ sở dữ liệu thực tế hoặc các dịch vụ bên ngoài.

- Mocking HttpClient: Để kiểm thử các API bên ngoài mà hệ thống tương tác, chúng tôi sử dụng HttpClient trong ứng dụng backend. Tuy nhiên, trong khi kiểm thử, thay vì gọi các API thực tế, chúng tôi sử dụng mocking để giả lập các phản hồi từ các dịch vụ bên ngoài. Điều này giúp đảm bảo rằng các logic xử lý API trong ứng dụng được kiểm tra mà không gây ra các cuộc gọi mạng thực tế.
## Nhóm phát triển

Dự án được thực hiện bởi một nhóm 5 thành viên:

1. **Nguyễn Thành Danh** - **Trưởng nhóm** & Backend Designer.
2. **Bùi Quang Vinh** - Frontend Developer, UI/UX Designer.
3. **Phạm Minh Quân** - Frontend Developer, UI/UX Designer.
4. **Trần Quang Duy** - DA, Tester, Frontend Developer.
5. **Trần Quang Khoa** - Frontend Developer.

## Hướng dẫn cài đặt

### Yêu cầu

- <img  src="https://nodejs.org/static/images/logo.svg"  width="100"  height="20">
- <img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Microsoft_.NET_logo.svg/640px-Microsoft_.NET_logo.svg.png"  width="70"  height="70">
- <img  src="https://www.vhv.rs/dpng/d/79-799586_microsoft-sql-server-logo-hd-png-download.png"  width="70"  height="70">

### Hướng dẫn cài đặt

1. **Clone the repository:**

   ```bash
   git clone https://github.com/td7legend/fa24-se1870-g6-koi-farm-shop.git
   cd fa24-se1870-g6-koi-farm-shop.git

   ```

2. **Cài đặt các gói frontend:**
   ```bash
   cd frontend
   cd swp391-project
   npm install
   ```
3. **Cài đặt các gói backend:**
   ```bash
   ...
   ```
4. **Cấu hình cơ sở dữ liệu:**
5. **Chạy ứng dụng**
   - Frontend:
     ```bash
     cd swp391-project
     npm run dev
     ```
   - Backend:
     ```
     Run .sln file by IDE
     ...
     ```

## Cách sử dụng

- **Đăng ký và Đăng nhập:** Truy cập trang chủ và sử dụng các liên kết để tạo tài khoản mới hoặc đăng nhập vào tài khoản hiện có.
- **Xem và Tìm kiếm Sản phẩm:** Sử dụng thanh tìm kiếm để tìm kiếm các loại cá koi mà bạn muốn.
- **Quản lý Giỏ hàng:** Thêm sản phẩm vào giỏ hàng và kiểm tra trước khi thực hiện thanh toán.
- **Theo dõi Đơn hàng:** Truy cập trang quản lý đơn hàng để xem tình trạng và chi tiết đơn hàng của bạn.

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng! Nếu bạn muốn đóng góp cho dự án này, hãy làm theo các bước sau:

1.  Fork repo này.
2.  Tạo một nhánh mới (`git checkout -b feature/your-feature`).
3.  Commit thay đổi của bạn (`git commit -m 'Add some feature'`).
4.  Đẩy nhánh lên repo của bạn (`git push origin feature/your-feature`).
5.  Mở Pull Request.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.

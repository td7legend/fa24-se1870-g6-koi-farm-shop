using koi_farm_demo.Repositories; // Add this line
using koi_farm_demo.Services; // Add this line
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace koi_farm_demo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("KoiFarmDemo");

            // Đăng ký DbContext với Entity Framework Core và SQL Server
            builder.Services.AddDbContext<KoiFarmDbContext>(options =>
                options.UseSqlServer(connectionString));
            builder.Services.AddControllers();
            // Đăng ký Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Đăng ký các dịch vụ Fish
            builder.Services.AddScoped<IFishRepository, FishRepository>();
            builder.Services.AddScoped<IFishService, FishService>();
            builder.Services.AddScoped<IFishTypeRepository, FishTypeRepository>();
            builder.Services.AddScoped<IFishTypeService, FishTypeService>();
            builder.Services.AddScoped<IOrderLineRepository, OrderLineRepository>();
            // Đăng ký các dịch vụ Order
            builder.Services.AddScoped<IOrderRepository, OrderRepository>(); // Đảm bảo bạn đã tạo OrderRepository
            builder.Services.AddScoped<IOrderService, OrderService>(); // Đảm bảo bạn đã tạo OrderService

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}

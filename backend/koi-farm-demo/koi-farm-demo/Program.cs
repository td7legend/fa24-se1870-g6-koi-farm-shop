using koi_farm_demo.Repositories; // Add this line
using koi_farm_demo.Services; // Add this line
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

namespace koi_farm_demo
{
    public class Program
    {

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("KoiFarmDemo");


            builder.Services.AddDbContext<KoiFarmDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Đăng ký JWT Authentication
            var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = "JwtBearer";
                options.DefaultChallengeScheme = "JwtBearer";
            })
            .AddJwtBearer("JwtBearer", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero // Loại bỏ thời gian đệm
                };
            })
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["GoogleOAuth:ClientId"];
                options.ClientSecret = builder.Configuration["GoogleOAuth:ClientSecret"];
                options.SaveTokens = true; // Lưu token để có thể truy cập sau này
                // Chuyển hướng người dùng đến một URL sau khi đăng nhập thành công
            });

            // Đăng ký Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
            });

            // Đăng ký các dịch vụ Fish
            builder.Services.AddScoped<IFishRepository, FishRepository>();
            builder.Services.AddScoped<IFishService, FishService>();
            builder.Services.AddScoped<IFishTypeRepository, FishTypeRepository>();
            builder.Services.AddScoped<IFishTypeService, FishTypeService>();
            builder.Services.AddScoped<IOrderLineRepository, OrderLineRepository>();

            // Đăng ký các dịch vụ Order
            builder.Services.AddScoped<IOrderRepository, OrderRepository>(); // Đảm bảo bạn đã tạo OrderRepository
            builder.Services.AddScoped<IOrderService, OrderService>(); // Đảm bảo bạn đã tạo OrderService
            builder.Services.AddScoped<ICustomerRepository, CustomerRepository>(); // Đảm bảo bạn đã tạo OrderLineRepository
            // Đăng ký các dịch vụ User
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddScoped<ICustomerService, CustomerService>();
            builder.Services.AddScoped<IRatingService, RatingService>();
            builder.Services.AddScoped<IRatingRepository, RatingRepository>();
            builder.Services.AddScoped<IConsignmentService, ConsignmentService>();
            builder.Services.AddScoped<IConsignmentRepository, ConsignmentRepository>();
            builder.Services.AddScoped<IFishCareService, FishCareService>();
            builder.Services.AddScoped<IFishCareRepository, FishCareRepository>();
            builder.Services.AddScoped<ILoyaltyPointRepository, LoyaltyPointRepository>();
            builder.Services.AddScoped<ILoyaltyPointService, LoyaltyPointService>();
            builder.Services.AddScoped<IRevenueService, RevenueService>();
            builder.Services.AddScoped<IStaffService, StaffService>();
            builder.Services.AddScoped<IStaffRepository, StaffRepository>();
            builder.Services.AddScoped<ICertificateRepository, CertificateRepository>();
            builder.Services.AddScoped<ICertificateService, CertificateService>();
            // Đăng ký các dịch vụ Customer
            builder.Services.AddAuthorization(options =>
            {
            });
            builder.Services.AddHttpClient();
            builder.Services.AddScoped<IStaffRepository, StaffRepository>();
            builder.Services.AddScoped<IVnPayService, VnPayService>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            // Add controllers
            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseRouting();
            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseSession();
            // Sử dụng Authentication và Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }

    }
}

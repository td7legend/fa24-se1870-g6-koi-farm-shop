using Microsoft.EntityFrameworkCore;

public class KoiFarmDbContext : DbContext
{
    public KoiFarmDbContext(DbContextOptions<KoiFarmDbContext> options) : base(options) { }

    // DbSet cho các bảng
    public DbSet<User> Users { get; set; }
    public DbSet<Staff> Staffs { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderLine> OrderLines { get; set; }
    public DbSet<Fish> Fish { get; set; }
    public DbSet<FishType> FishTypes { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<Consignment> Consignments { get; set; }
    public DbSet<ConsignmentLine> ConsignmentLines { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<LoyaltyPoint> LoyaltyPoints { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Cấu hình bảng User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.HashPassword).IsRequired();
            entity.Property(e => e.Role).IsRequired();
        });

        // Cấu hình bảng Staff
        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role).IsRequired();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.PhoneNumber).IsRequired();

            // Cấu hình quan hệ 1-1 giữa Staff và User
            entity.HasOne(e => e.User)
                  .WithOne()
                  .HasForeignKey<Staff>(e => e.UserId)  // Sử dụng trực tiếp UserId
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng Customer
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Address).IsRequired();
            entity.Property(e => e.Tier).IsRequired();
            entity.Property(e => e.PointAvailable).IsRequired();
            entity.Property(e => e.UsedPoint).IsRequired();
            entity.Property(e => e.AccommodatePoint).IsRequired();

            entity.HasOne(e => e.User)
                  .WithOne()
                  .HasForeignKey<Customer>(e => e.UserId)  // Sử dụng trực tiếp UserId
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng Order
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.TotalAmount).IsRequired();
            entity.Property(e => e.TotalTax).IsRequired();
            entity.Property(e => e.TotalDiscount).IsRequired();

            // Thay đổi mối quan hệ từ WithOne sang WithMany
            entity.HasOne<Customer>()
                  .WithMany(c => c.Orders)  // Khai báo rằng Customer có nhiều Orders
                  .HasForeignKey(e => e.CustomerId)  // Sử dụng trực tiếp CustomerId
                  .OnDelete(DeleteBehavior.Cascade);
        });


        // Cấu hình bảng OrderLine
        modelBuilder.Entity<OrderLine>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.FishId }); // Khóa chính là sự kết hợp của OrderId và FishId
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.UnitPrice).IsRequired();
            entity.Property(e => e.TotalPrice).IsRequired();

            entity.HasOne(e => e.Order) // Mối quan hệ với Order
                  .WithMany(e => e.OrderLines) // Một Order có nhiều OrderLines
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Fish) // Mối quan hệ với Fish
                  .WithMany(e => e.OrderLines) // Một Fish có thể nằm trong nhiều OrderLines
                  .HasForeignKey(e => e.FishId) // Sử dụng trực tiếp FishId
                  .OnDelete(DeleteBehavior.Restrict); // Không tự động xóa OrderLines khi Fish bị xóa
        });


        // Cấu hình bảng Fish
        // Cấu hình bảng Fish
        modelBuilder.Entity<Fish>(entity =>
        {
            entity.HasKey(e => e.FishId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Gender).IsRequired();
            entity.Property(e => e.Age).IsRequired();
            entity.Property(e => e.Size).IsRequired();
            entity.Property(e => e.Class).IsRequired();
            entity.Property(e => e.FoodRequirement).IsRequired();
            entity.Property(e => e.OverallRating).IsRequired();
            entity.Property(e => e.Price).IsRequired();
            entity.Property(e => e.Batch).IsRequired();

            // Thiết lập mối quan hệ Nhiều đến Một với FishType
            entity.HasOne(e => e.FishType)
                  .WithMany(e => e.Fishes) // Thay đổi từ WithOne() sang WithMany()
                  .HasForeignKey(e => e.FishTypeId) // Khóa ngoại trong bảng Fish
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Cấu hình bảng FishType
        modelBuilder.Entity<FishType>(entity =>
        {
            entity.HasKey(e => e.FishTypeId);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
        });


        // Cấu hình bảng Certification
        modelBuilder.Entity<Certification>(entity =>
        {
            entity.HasKey(e => e.CertificationId);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.IssueDate).IsRequired();

            entity.HasOne(e => e.Fish)
                  .WithMany()
                  .HasForeignKey(e => e.FishId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng Consignment
        modelBuilder.Entity<Consignment>(entity =>
        {
            entity.HasKey(e => e.ConsignmentId);
            entity.Property(e => e.StartDate).IsRequired();
            entity.Property(e => e.EndDate).IsRequired();
            entity.Property(e => e.Amount).IsRequired();
            entity.Property(e => e.Status).IsRequired();

            // Thiết lập mối quan hệ "Một Staff có nhiều Consignment"
            entity.HasOne(e => e.Staff)
                  .WithMany(s => s.Consignments)  // Một Staff có nhiều Consignment
                  .HasForeignKey(e => e.StaffId)  // Khóa ngoại trong bảng Consignment
                  .OnDelete(DeleteBehavior.Cascade);
        });


        // Cấu hình bảng ConsignmentLine
        modelBuilder.Entity<ConsignmentLine>(entity =>
        {
            entity.HasKey(e => e.ConsignmentLineId);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.UnitPrice).IsRequired();
            entity.Property(e => e.TotalPrice).IsRequired();

            entity.HasOne(e => e.Consignment)
                  .WithMany(e => e.ConsignmentLines)
                  .HasForeignKey(e => e.ConsignmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Fish)
                  .WithMany()
                  .HasForeignKey(e => e.FishId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Cấu hình bảng Rating
        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(e => e.RatingId);
            entity.Property(e => e.RatingValue).IsRequired();
            entity.Property(e => e.Comment).HasMaxLength(500);

            entity.HasOne(e => e.Customer)
                  .WithMany(e => e.Ratings)
                  .HasForeignKey(e => e.CustomerId)  // Sử dụng trực tiếp CustomerId
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Fish)
                  .WithMany()
                  .HasForeignKey(e => e.FishId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng LoyaltyPoint
        modelBuilder.Entity<LoyaltyPoint>(entity =>
        {
            entity.HasKey(e => e.LPId);
            entity.Property(e => e.Amount).IsRequired();
            entity.Property(e => e.AwardedDate).IsRequired();

            entity.HasOne(e => e.Customer)
                  .WithMany()
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

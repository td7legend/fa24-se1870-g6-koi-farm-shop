using koi_farm_demo.Models;
using Microsoft.EntityFrameworkCore;

public class KoiFarmDbContext : DbContext
{
    public KoiFarmDbContext(DbContextOptions<KoiFarmDbContext> options) : base(options) { }

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
    public DbSet<FishCare> FishCares { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.HashPassword).IsRequired();
            entity.Property(e => e.Role).IsRequired();
            entity.Property(e => e.GoogleId);
        });

        
        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role).IsRequired();
            entity.Property(e => e.PhoneNumber).IsRequired();

            
            entity.HasOne(e => e.User)
                  .WithOne()
                  .HasForeignKey<Staff>(e => e.UserId)  
                  .OnDelete(DeleteBehavior.Cascade);
        });

        
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Address).IsRequired();
            entity.Property(e => e.Tier).IsRequired();
            entity.Property(e => e.PointAvailable).IsRequired();
            entity.Property(e => e.UsedPoint).IsRequired();
            entity.Property(e => e.AccommodatePoint).IsRequired();
            entity.Property(e => e.PhoneNumber);
            entity.HasOne(e => e.User)
                  .WithOne()
                  .HasForeignKey<Customer>(e => e.UserId)  
                  .OnDelete(DeleteBehavior.Cascade);
        });

       
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.TotalAmount).IsRequired();
            entity.Property(e => e.TotalTax).IsRequired();
            entity.Property(e => e.TotalDiscount).IsRequired();
            entity.Property(e => e.OrderDate);
            entity.Property(e => e.Address);

            entity.HasOne<Customer>()
                  .WithMany(c => c.Orders)  
                  .HasForeignKey(e => e.CustomerId)  
                  .OnDelete(DeleteBehavior.Cascade);
        });


        // Cấu hình bảng OrderLine
        modelBuilder.Entity<OrderLine>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.FishId }); 
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.UnitPrice).IsRequired();
            entity.Property(e => e.TotalPrice).IsRequired();

            entity.HasOne(e => e.Order) 
                  .WithMany(e => e.OrderLines) 
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Fish) 
                  .WithMany(e => e.OrderLines)
                  .HasForeignKey(e => e.FishId) 
                  .OnDelete(DeleteBehavior.Restrict); 
        });


        
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
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.ImageUrl).IsRequired();


            entity.HasOne(e => e.FishType)
                  .WithMany(e => e.Fishes) 
                  .HasForeignKey(e => e.FishTypeId) 
                  .OnDelete(DeleteBehavior.Restrict);
        });

        
        modelBuilder.Entity<FishType>(entity =>
        {
            entity.HasKey(e => e.FishTypeId);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
        });


        
        modelBuilder.Entity<Certification>(entity =>
        {
            entity.HasKey(e => e.CertificationId);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Url).IsRequired();

            entity.HasOne(e => e.Fish)
                  .WithMany()
                  .HasForeignKey(e => e.FishId)
                  .OnDelete(DeleteBehavior.Cascade);
        });


        //modelBuilder.Entity<Consignment>(entity =>
        //{
        //    entity.HasKey(e => e.ConsignmentId);
        //    entity.Property(e => e.StartDate).IsRequired();
        //    entity.Property(e => e.EndDate).IsRequired();
        //    entity.Property(e => e.Amount).IsRequired();
        //    entity.Property(e => e.Status).IsRequired();


        //    entity.HasOne(e => e.Staff)
        //          .WithMany(s => s.Consignments)  
        //          .HasForeignKey(e => e.StaffId)  
        //          .OnDelete(DeleteBehavior.Cascade);
        //});



        //modelBuilder.Entity<ConsignmentLine>(entity =>
        //{
        //    entity.HasKey(e => e.ConsignmentLineId);
        //    entity.Property(e => e.Quantity).IsRequired();
        //    entity.Property(e => e.UnitPrice).IsRequired();
        //    entity.Property(e => e.TotalPrice).IsRequired();

        //    entity.HasOne(e => e.Consignment)
        //          .WithMany(e => e.ConsignmentLines)
        //          .HasForeignKey(e => e.ConsignmentId)
        //          .OnDelete(DeleteBehavior.Cascade);

        //    entity.HasOne(e => e.Fish)
        //          .WithMany()
        //          .HasForeignKey(e => e.FishId)
        //          .OnDelete(DeleteBehavior.Restrict);
        //});
        modelBuilder.Entity<Consignment>(entity =>
        {
            entity.HasKey(e => e.ConsignmentId);
            entity.Property(e => e.StartDate).IsRequired();
            entity.Property(e => e.EndDate); // Nullable
            entity.Property(e => e.CareFee).IsRequired();
            entity.Property(e => e.AgreedPrice).IsRequired();
            entity.Property(e => e.Price).IsRequired();
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.Type).IsRequired();

            // Quan hệ với bảng Staff (nullable foreign key)

            // Quan hệ với bảng Customer
            entity.HasOne<Customer>()
                  .WithMany(c => c.Consignments)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng ConsignmentLine
        modelBuilder.Entity<ConsignmentLine>(entity =>
        {
            entity.HasKey(e => e.ConsignmentLineId);
            entity.Property(e => e.FishType).IsRequired();
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.ImageUrl).HasMaxLength(200);
            entity.Property(e => e.CertificationUrl).HasMaxLength(200);
            entity.Property(e => e.TotalPrice).IsRequired();

            // Quan hệ với bảng Consignment
            entity.HasOne(e => e.Consignment)
                  .WithMany(e => e.ConsignmentLines)
                  .HasForeignKey(e => e.ConsignmentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình bảng FishCare
        modelBuilder.Entity<FishCare>(entity =>
        {
            entity.HasKey(e => e.FishCareId);
            entity.Property(e => e.FishType).IsRequired();
            entity.Property(e => e.HealthStatus).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CareDetails).HasMaxLength(500);

            // Quan hệ với bảng Consignment
            entity.HasOne<Consignment>()
          .WithMany()
          .HasForeignKey(e => e.ConsignmentId)
          .OnDelete(DeleteBehavior.Cascade);
        });

        // Other entity configurations...


        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(e => e.RatingId);
            entity.Property(e => e.RatingValue).IsRequired();
            entity.Property(e => e.Comment).HasMaxLength(500);

            entity.HasOne(e => e.Customer)
                  .WithMany(e => e.Ratings)
                  .HasForeignKey(e => e.CustomerId)  
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Fish)
                  .WithMany()
                  .HasForeignKey(e => e.FishId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        
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

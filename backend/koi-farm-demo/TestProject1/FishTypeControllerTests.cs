using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using koi_farm_demo;
using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using ikvm.runtime;
public class FishTypeControllerTests : IClassFixture<WebApplicationFactory<koi_farm_demo.Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<koi_farm_demo.Program> _factory;

    public FishTypeControllerTests(WebApplicationFactory<koi_farm_demo.Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<KoiFarmDbContext>));
                services.AddDbContext<KoiFarmDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDatabase");
                });

                services.AddScoped<IFishTypeService, FishTypeService>();
            });
        });

        _client = _factory.CreateClient();
    }


    [Fact]
    public async Task AddFishType_ReturnsCreatedAtAction_WhenAddSucceeds()
    {
        // Arrange
        var fishTypeCreateDto = new FishTypeCreateDto { Name = "Koi", Description = "Beautiful fish" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/fishtypes", fishTypeCreateDto);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<FishType>();
        Assert.NotNull(result);
        Assert.Equal("Koi", result.Name);
    }

    [Fact]
    public async Task AddFishType_ReturnsBadRequest_WhenAddFails()
    {
        // Arrange: Tạo đối tượng FishTypeCreateDto không hợp lệ
        FishTypeCreateDto fishTypeCreateDto = null;

        // Act
        var response = await _client.PostAsJsonAsync("/api/fishtypes", fishTypeCreateDto);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}

using Xunit;
using Moq;
using koi_farm_demo.Controllers;
using koi_farm_demo.Services;
using koi_farm_demo.Models;
using koi_farm_demo.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

public class FishControllerTests
{
    private readonly Mock<IFishService> _fishServiceMock;
    private readonly FishController _fishController;

    public FishControllerTests()
    {
        // Tạo mock cho IFishService
        _fishServiceMock = new Mock<IFishService>();

        // Inject mock vào FishController
        _fishController = new FishController(_fishServiceMock.Object);
    }


    [Fact]
    public async Task GetFish_ReturnsOkResult_WithFish()
    {
        // Arrange: chuẩn bị dữ liệu giả
        var fishId = 1;
        var mockFish = new Fish { FishId = fishId, Name = "Koi1" };
        _fishServiceMock.Setup(service => service.GetFishByIdAsync(fishId)).ReturnsAsync(mockFish);

        // Act
        var result = await _fishController.GetFish(fishId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnFish = Assert.IsType<Fish>(okResult.Value);
        Assert.Equal(fishId, returnFish.FishId);
    }

    [Fact]
    public async Task GetFish_ReturnsNotFound_WhenFishNotExists()
    {
        // Arrange
        var fishId = 1;
        _fishServiceMock.Setup(service => service.GetFishByIdAsync(fishId)).ReturnsAsync((Fish)null);

        // Act
        var result = await _fishController.GetFish(fishId);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task PostFish_ReturnsCreatedAtActionResult()
    {
        // Arrange: Chuẩn bị dữ liệu
        var fishCreateDto = new FishCreateDto { Name = "Koi1", Quantity = 10 };

        _fishServiceMock.Setup(service => service.AddFishAsync(fishCreateDto)).Returns(Task.CompletedTask);

        // Act: Gọi API
        var result = await _fishController.AddFish(fishCreateDto);

        // Assert: Kiểm tra kết quả
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(FishController.GetFish), createdAtActionResult.ActionName);
    }

    [Fact]
    public async Task DeleteFish_ReturnsNoContent_WhenSuccess()
    {
        // Arrange: giả lập hành vi thành công
        var fishId = 1;
        _fishServiceMock.Setup(service => service.DeleteFishAsync(fishId)).Returns(Task.CompletedTask);

        // Act: gọi API
        var result = await _fishController.DeleteFish(fishId);

        // Assert: kiểm tra kết quả
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdateQuantity_ReturnsNoContent_WhenSuccess()
    {
        // Arrange
        var fishId = 1;
        var quantity = 5;
        var fish = new Fish { FishId = fishId, Name = "Koi1", Quantity = 10 };

        // Giả lập hành vi của service
        _fishServiceMock.Setup(service => service.GetFishByIdAsync(fishId)).ReturnsAsync(fish);
        _fishServiceMock.Setup(service => service.UpdateFishQuantityAsync(fishId, quantity)).Returns(Task.CompletedTask);

        // Act
        var result = await _fishController.UpdateQuantity(fishId, quantity);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdateQuantity_ReturnsNotFound_WhenFishNotExists()
    {
        // Arrange
        var fishId = 1;
        _fishServiceMock.Setup(service => service.GetFishByIdAsync(fishId)).ReturnsAsync((Fish)null);

        // Act
        var result = await _fishController.UpdateQuantity(fishId, 5);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}

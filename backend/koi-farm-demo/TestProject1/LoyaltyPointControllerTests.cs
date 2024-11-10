using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using koi_farm_demo.Controllers;
using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

    public class LoyaltyPointControllerTests
    {
        private readonly Mock<ILoyaltyPointService> _mockLoyaltyPointService;
        private readonly Mock<ICustomerService> _mockCustomerService;
        private readonly LoyaltyPointController _controller;

        public LoyaltyPointControllerTests()
        {
            _mockLoyaltyPointService = new Mock<ILoyaltyPointService>();
            _mockCustomerService = new Mock<ICustomerService>();
            _controller = new LoyaltyPointController(_mockLoyaltyPointService.Object, _mockCustomerService.Object);
        }
        [Fact]
        public async Task AwardPoints_ShouldReturnOk_WhenPointsAwardedSuccessfully()
        {
            // Arrange
            int customerId = 1;
            decimal orderAmount = 100;
            _mockLoyaltyPointService.Setup(service => service.AwardPointsAsync(customerId, orderAmount))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AwardPoints(customerId, orderAmount);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Points awarded successfully", (result as OkObjectResult).Value);
        }

        [Fact]
        public async Task AwardPoints_ShouldReturnBadRequest_WhenExceptionThrown()
        {
            // Arrange
            int customerId = 1;
            decimal orderAmount = 100;
            _mockLoyaltyPointService.Setup(service => service.AwardPointsAsync(customerId, orderAmount))
                .Throws(new Exception("Service failure"));

            // Act
            var result = await _controller.AwardPoints(customerId, orderAmount);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Service failure", (result as BadRequestObjectResult).Value);
        }
        [Fact]
        public async Task RedeemPoints_ShouldReturnOk_WhenPointsRedeemedSuccessfully()
        {
            // Arrange
            int customerId = 1;
            int pointsToRedeem = 50;
            _mockLoyaltyPointService.Setup(service => service.RedeemPointsAsync(customerId, pointsToRedeem))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.RedeemPoints(customerId, pointsToRedeem);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Points redeemed successfully", (result as OkObjectResult).Value);
        }

        [Fact]
        public async Task RedeemPoints_ShouldReturnBadRequest_WhenInsufficientPoints()
        {
            // Arrange
            int customerId = 1;
            int pointsToRedeem = 50;
            _mockLoyaltyPointService.Setup(service => service.RedeemPointsAsync(customerId, pointsToRedeem))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.RedeemPoints(customerId, pointsToRedeem);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Insufficient points", (result as BadRequestObjectResult).Value);
        }

        [Fact]
        public async Task RedeemPoints_ShouldReturnBadRequest_WhenExceptionThrown()
        {
            // Arrange
            int customerId = 1;
            int pointsToRedeem = 50;
            _mockLoyaltyPointService.Setup(service => service.RedeemPointsAsync(customerId, pointsToRedeem))
                .Throws(new Exception("Service failure"));

            // Act
            var result = await _controller.RedeemPoints(customerId, pointsToRedeem);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Service failure", (result as BadRequestObjectResult).Value);
        }

        [Fact]
        public async Task GetPointHistory_ShouldReturnBadRequest_WhenUserIdInvalid()
        {
            // Arrange
            var claims = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, "invalid") }));
            _controller.ControllerContext = new ControllerContext() { HttpContext = new DefaultHttpContext { User = claims } };

            // Act
            var result = await _controller.GetPointHistory();

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid user ID.", (result as BadRequestObjectResult).Value);
        }

    }


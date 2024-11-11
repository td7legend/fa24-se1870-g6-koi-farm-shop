using koi_farm_demo.Controllers;
using koi_farm_demo.Data;
using koi_farm_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

    public class RatingControllerTests
    {
        private readonly Mock<IRatingService> _mockRatingService;
        private readonly RatingController _controller;

        public RatingControllerTests()
        {
            _mockRatingService = new Mock<IRatingService>();
            _controller = new RatingController(_mockRatingService.Object);
        }

        [Theory]
        [InlineData(123, 1, 5, "Excellent!", "Đánh giá thành công!")] // Thử nghiệm thành công
        [InlineData(123, 1, 5, "", "Đánh giá thành công!")] // Thử nghiệm thành công với comment trống
        public async Task RateFish_ReturnsOk_WhenRatingIsAddedSuccessfully(int userId, int fishId, int ratingValue, string comment, string expectedMessage)
        {
            // Arrange
            var rateFishDto = new RateFishDto { FishId = fishId, RatingValue = ratingValue, Comment = comment };
            var userIdClaim = new Claim(ClaimTypes.Name, userId.ToString());
            var userClaimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { userIdClaim }));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaimsPrincipal }
            };

            // Act
            var result = await _controller.RateFish(rateFishDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedMessage, okResult.Value);
            _mockRatingService.Verify(service => service.AddRatingAsync(userId, fishId, ratingValue, comment), Times.Once);
        }

        [Theory]
        [InlineData("invalid_id")] // ID không hợp lệ
        [InlineData("abc")] // ID không phải là số
        public async Task RateFish_ReturnsBadRequest_WhenUserIdIsInvalid(string userId)
        {
            // Arrange
            var rateFishDto = new RateFishDto { FishId = 1, RatingValue = 5, Comment = "Excellent!" };
            var userIdClaim = new Claim(ClaimTypes.Name, userId);
            var userClaimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new[] { userIdClaim }));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = userClaimsPrincipal }
            };

            // Act
            var result = await _controller.RateFish(rateFishDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid user ID.", badRequestResult.Value);
        }


        [Theory]
        [InlineData(1, true)] // Có đánh giá
        [InlineData(2, false)] // Không có đánh giá
        public async Task GetRatingsForFish_ReturnsCorrectResponse(int fishId, bool hasRatings)
        {
            // Arrange
            var ratings = hasRatings ? new List<RatingDto>
            {
                new RatingDto { RatingValue = 5, Comment = "Excellent!" }
            } : new List<RatingDto>();

            _mockRatingService.Setup(service => service.GetRatingsForFishAsync(fishId)).ReturnsAsync(ratings);

            // Act
            var result = await _controller.GetRatingsForFish(fishId);

            // Assert
            if (hasRatings)
            {
                var okResult = Assert.IsType<OkObjectResult>(result);
                Assert.Equal(ratings, okResult.Value);
            }
            else
            {
                var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
                Assert.Equal("Không có đánh giá nào cho con cá này.", notFoundResult.Value);
            }
        }
    }


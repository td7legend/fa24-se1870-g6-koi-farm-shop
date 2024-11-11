﻿using koi_farm_demo.Data;
using koi_farm_demo.Models;
using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    // FishService.cs
    public class FishService : IFishService
    {
        private readonly IFishRepository _fishRepository;
        private readonly ICertificateRepository _certificateRepository;
        private readonly IFishImageRepository _fishImageRepository;
        public FishService(IFishRepository fishRepository, ICertificateRepository certificateRepository, IFishImageRepository fishImageRepository)
        {
            _fishRepository = fishRepository;
            _certificateRepository = certificateRepository;
            _fishImageRepository = fishImageRepository;
        }

        public async Task<IEnumerable<Fish>> GetAllFishAsync()
        {
            return await _fishRepository.GetAllAsync();
        }

        public async Task<Fish> GetFishByIdAsync(int id)
        {
            return await _fishRepository.GetByIdAsync(id);
        }

        public async Task AddFishAsync(FishCreateDto fishCreateDto)
        {
            var fish = new Fish
            {
                Name = fishCreateDto.Name,
                Gender = fishCreateDto.Gender,
                Age = fishCreateDto.Age,
                Size = fishCreateDto.Size ?? 0,
                Class = fishCreateDto.Class,
                FoodRequirement = fishCreateDto.FoodRequirement ?? 0,
                OverallRating = fishCreateDto.OverallRating ?? 0,
                Price = fishCreateDto.Price ?? 0,
                Batch = fishCreateDto.Batch ?? false,
                FishTypeId = fishCreateDto.FishTypeId,
                ImageUrl = fishCreateDto.ImageUrl,
                Quantity = fishCreateDto.Quantity,
                Description = fishCreateDto.Description,
                ConsignmentLineId = fishCreateDto.ConsignmentLineId
            };

            await _fishRepository.AddAsync(fish);
            if (fishCreateDto.Certificate != null)
            {
                var certificate = new Certification
                {
                    FishId = fish.FishId,  // Sau khi thêm cá, FishId đã có giá trị
                    Description = fishCreateDto.Certificate.Description,
                    IssueDate = fishCreateDto.Certificate.IssueDate,
                    Url = fishCreateDto.Certificate.Url
                };

                await _certificateRepository.AddCertificateAsync(certificate);
            }
            foreach (var imageUrl in fishCreateDto.ImageUrls)
            {
                var fishImage = new FishImage
                {
                    FishId = fish.FishId,
                    ImageUrl = imageUrl
                };
                await _fishImageRepository.AddFishImageAsync(fishImage);
            }

        }
        public async Task<IEnumerable<FishImage>> GetFishImagesByFishIdAsync(int fishId)
        {
            return await _fishImageRepository.GetFishImagesByFishIdAsync(fishId);

        }


        public async Task UpdateFishAsync(Fish fish)
        {
            await _fishRepository.UpdateAsync(fish);
        }

        public async Task DeleteFishAsync(int id)
        {
            await _fishRepository.DeleteAsync(id);
        }
        public async Task UpdateFishQuantityAsync(int id, int quantity)
        {
            await _fishRepository.UpdateQuantityAsync(id, quantity);
        }
    }

}

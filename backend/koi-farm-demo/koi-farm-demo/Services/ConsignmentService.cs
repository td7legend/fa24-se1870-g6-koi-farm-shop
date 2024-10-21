using koi_farm_demo.Models;
using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public class ConsignmentService : IConsignmentService
    {
        private readonly IConsignmentRepository _consignmentRepository;
        private readonly IFishService _fishService;
        private readonly IFishRepository _fishRepository;   
        public ConsignmentService(IConsignmentRepository consignmentRepository, IFishService fishService, IFishRepository fishRepository)
        {
            _consignmentRepository = consignmentRepository;
            _fishService = fishService;
            _fishRepository = fishRepository;
        }

        public async Task<Consignment> CreateSaleConsignmentAsync(CreateConsignmentRequest request)
        {
            var consignment = new Consignment
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                CareFee = 0,
                AgreedPrice = request.AgreedPrice,
                Type = ConsignmentType.Sale,
                Status = ConsignmentStatus.Pending,
                StaffId = null,
                CustomerId = request.CustomerId,
                Note = request.Note,
                ConsignmentLines = request.ConsignmentLines.Select(line => new ConsignmentLine
                {
                    FishType = line.FishType,
                    Quantity = line.Quantity,
                    ImageUrl = line.ImageUrl,
                    CertificationUrl = line.CertificationUrl
                }).ToList()
            };

            await _consignmentRepository.AddAsync(consignment);
            await _consignmentRepository.SaveChangesAsync();
            return consignment;
        }

        public async Task<Consignment> CreateCareConsignmentAsync(CreateCareConsignmentRequest request)
        {
            var consignment = new Consignment
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                CareFee = 0,
                AgreedPrice = 0,
                Type = ConsignmentType.Care,
                Status = ConsignmentStatus.Pending,
                StaffId = null,
                CustomerId = request.CustomerId,
                Note = request.Note,
                ConsignmentLines = request.ConsignmentLines.Select(line => new ConsignmentLine
                {
                    FishType = line.FishType,
                    Quantity = line.Quantity,
                    ImageUrl = line.ImageUrl,
                    CertificationUrl = line.CertificationUrl
                }).ToList()
            };

            await _consignmentRepository.AddAsync(consignment);
            await _consignmentRepository.SaveChangesAsync();
            return consignment;
        }

        public async Task UpdateConsignmentStatusAsync(int consignmentId, ConsignmentStatus status)
        {
            var consignment = await _consignmentRepository.GetByIdAsync(consignmentId);
            if (consignment == null)
                throw new Exception("Consignment not found.");

            consignment.Status = status;
            await _consignmentRepository.UpdateAsync(consignment);
            await _consignmentRepository.SaveChangesAsync();
        }

        public async Task ReceiveConsignmentForSaleAsync(int consignmentId)
        {
            var consignment = await _consignmentRepository.GetByIdAsync(consignmentId);
            if (consignment == null)
                throw new Exception("Consignment not found.");

            if (consignment.Status != ConsignmentStatus.Confirmed)
                throw new Exception("Consignment must be confirmed first.");

            foreach (var line in consignment.ConsignmentLines)
            {
                var fish = new Fish
                {
                    Name = line.FishType,
                    Price = line.TotalPrice,
                    Quantity = line.Quantity,
                    ImageUrl = line.ImageUrl,
                    FishTypeId = 1,  
                    ConsignmentLineId = line.ConsignmentLineId
                };
                
            }

            consignment.Status = ConsignmentStatus.ListedForSale;
            await _consignmentRepository.UpdateAsync(consignment);
            await _consignmentRepository.SaveChangesAsync();
        }

        public async Task ReceiveConsignmentForCareAsync(int consignmentId)
        {
            var consignment = await _consignmentRepository.GetByIdAsync(consignmentId);
            if (consignment == null)
                throw new Exception("Consignment not found.");

            if (consignment.Status != ConsignmentStatus.Confirmed)
                throw new Exception("Consignment must be confirmed first.");

            foreach (var line in consignment.ConsignmentLines)
            {
                var fishCare = new FishCare
                {
                    ConsignmentId = consignmentId,
                    HealthStatus = "Healthy",
                    CareDetails = "Initial care started"
                };
            }

            consignment.Status = ConsignmentStatus.UnderCare;
            await _consignmentRepository.UpdateAsync(consignment);
            await _consignmentRepository.SaveChangesAsync();
        }
        public async Task UpdateAgreedPriceAndAddFishAsync(int consignmentId, long agreedPrice, List<FishDetails> fishDetails)
        {
            var consignment = await _consignmentRepository.GetByIdAsync(consignmentId);
            if (consignment == null)
                throw new Exception("Consignment not found.");

            consignment.AgreedPrice = agreedPrice;
            await _consignmentRepository.UpdateAsync(consignment);
            foreach (var fishDetail in fishDetails)
            {
                var fish = new Data.FishCreateDto
                {
                    Name = fishDetail.Name,
                    Gender = fishDetail.Gender,
                    Age = fishDetail.Age,
                    Size = fishDetail.Size,
                    Class = fishDetail.Class,
                    FoodRequirement = fishDetail.FoodRequirement,
                    OverallRating = fishDetail.OverallRating,
                    Price = fishDetail.Price,
                    Quantity = fishDetail.Quantity,
                    ImageUrl = fishDetail.ImageUrl,
                    FishTypeId = fishDetail.FishTypeId,
                };

                await _fishService.AddFishAsync(fish);
            }

            await _consignmentRepository.SaveChangesAsync();
        }
        public async Task UpdateCareFeeAndStatusAsync(int consignmentId, decimal newCareFee, ConsignmentStatus newStatus)
        {
            var consignment = await _consignmentRepository.GetByIdAsync(consignmentId);
            if (consignment == null)
                throw new Exception("Consignment not found.");

            consignment.CareFee = newCareFee;
            consignment.Status = newStatus;

            await _consignmentRepository.UpdateAsync(consignment);
            await _consignmentRepository.SaveChangesAsync();
        }
        public async Task CheckAndUpdateAllConsignmentStatusesAsync()
        {

            var consignments = await _consignmentRepository.GetAllWithLinesAsync(); 

            foreach (var consignment in consignments)
            {
                var allFishSold = true;
                foreach (var cl in consignment.ConsignmentLines)
                {
                    var fish = await _fishRepository.GetByConsignmentLineId(cl.ConsignmentLineId);
                    if (fish == null || fish.Quantity != 0)
                    {
                        allFishSold = false;
                        break;
                    }
                }

                if (allFishSold)
                {
                    consignment.Status = ConsignmentStatus.Sold;
                    await _consignmentRepository.UpdateAsync(consignment);
                }
            }

            await _consignmentRepository.SaveChangesAsync();
        }

    }
}

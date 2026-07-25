using Portfolio.API.Models.Domain;

namespace Portfolio.API.Repositories.Interface
{
	public interface IImageRepository
	{
		Task<PortfolioImage> UploadAsync(IFormFile file, PortfolioImage portfolioImage);

		Task<IEnumerable<PortfolioImage>> GetAllAsync();

		Task<PortfolioImage?> DeleteAsync(Guid id);
	}
}

using Portfolio.API.Models.Domain;

namespace Portfolio.API.Repositories.Interface
{
	public interface IPortfolioRepository
	{
		Task<PortfolioProject> CreateAsync(PortfolioProject portfolioProject);

		Task<IEnumerable<PortfolioProject>> GetAllAsync();

		Task<PortfolioProject?> GetByIdAsync(Guid id);

		Task<PortfolioProject?> UpdateAsync(PortfolioProject portfolioProject);

		Task<PortfolioProject?> DeleteAsync(Guid id);

		Task<PortfolioProject?> GetByUrlAsync(string url);

		Task<IEnumerable<PortfolioProject>> GetHomePortfoliosAsync(int count);
	}
}

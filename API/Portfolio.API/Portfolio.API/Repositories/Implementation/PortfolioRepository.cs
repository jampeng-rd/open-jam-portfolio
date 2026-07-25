using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models.Domain;
using Portfolio.API.Repositories.Interface;
using System.Runtime.InteropServices;

namespace Portfolio.API.Repositories.Implementation
{
	public class PortfolioRepository: IPortfolioRepository
	{
		private readonly ApplicationDbContext dbContext;

		public PortfolioRepository(ApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		public async Task<PortfolioProject> CreateAsync(PortfolioProject portfolioProject)
		{
			await dbContext.Portfolios.AddAsync(portfolioProject);
			await dbContext.SaveChangesAsync();
			return portfolioProject;
		}

		public async Task<IEnumerable<PortfolioProject>> GetAllAsync()
		{
			return await dbContext.Portfolios.Include(x => x.Technologies).ToListAsync();
		}

		public async Task<PortfolioProject?> GetByIdAsync(Guid id)
		{
			return await dbContext.Portfolios.Include(x => x.Technologies).FirstOrDefaultAsync(x => x.Id == id);
		}

		public async Task<PortfolioProject?> UpdateAsync(PortfolioProject portfolioProject)
		{
			var existingPortfolio= await dbContext.Portfolios.Include(x => x.Technologies)
				.FirstOrDefaultAsync(x => x.Id == portfolioProject.Id);

			if (existingPortfolio == null)
			{
				return null;
			}

			// Update Portfolio
			dbContext.Entry(existingPortfolio).CurrentValues.SetValues(portfolioProject);

			// Update Technologies
			existingPortfolio.Technologies = portfolioProject.Technologies;

			await dbContext.SaveChangesAsync();
			return portfolioProject;
		}

		public async Task<PortfolioProject?> DeleteAsync(Guid id)
		{
			var existingPortfolio = await dbContext.Portfolios.FirstOrDefaultAsync(x => x.Id == id);

			if (existingPortfolio is null)
			{
				return null;
			}

			dbContext.Portfolios.Remove(existingPortfolio);
			await dbContext.SaveChangesAsync();
			return existingPortfolio;
		}

		public async Task<PortfolioProject?> GetByUrlAsync(string url)
		{
			return await dbContext.Portfolios.Include(x => x.Technologies).FirstOrDefaultAsync(x => x.Name == url);
		}

		public async Task<IEnumerable<PortfolioProject>> GetHomePortfoliosAsync(int count)
		{
			return await dbContext.Portfolios
				.AsNoTracking()
				.Include(x => x.Technologies)
				.Where(x => x.IsVisible)
				.OrderBy(x => x.Name)
				.Take(count)
				.ToListAsync();
		}

	}
}

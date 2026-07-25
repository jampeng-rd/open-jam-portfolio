using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models.Domain;
using Portfolio.API.Repositories.Interface;

namespace Portfolio.API.Repositories.Implementation
{
	public class TechnologyRepository: ITechnologyRepository
	{
		private readonly ApplicationDbContext dbContext;

		public TechnologyRepository(ApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		public async Task<Technology> CreateAsync(Technology technology)
		{
			await dbContext.Technologys.AddAsync(technology);
			await dbContext.SaveChangesAsync();
			return technology;
		}

		public async Task<IEnumerable<Technology>> GetAllAsync()
		{
			return await dbContext.Technologys.ToListAsync();
		}

		public async Task<Technology?> GetByIdAsync(Guid id)
		{
			return await dbContext.Technologys.FirstOrDefaultAsync(x => x.Id == id);
		}

		public async Task<Technology?> UpdateAsync(Technology technology)
		{
			var existingTechnology = await dbContext.Technologys.FirstOrDefaultAsync(x => x.Id == technology.Id);

			if (existingTechnology is not null)
			{
				dbContext.Entry(existingTechnology).CurrentValues.SetValues(technology);
				await dbContext.SaveChangesAsync();
				return technology;
			}

			return null;
		}

		public async Task<Technology?> DeleteAsync(Guid id)
		{
			var existingTechnology = await dbContext.Technologys.FirstOrDefaultAsync(x => x.Id == id);

			if (existingTechnology is null)
			{
				return null;
			}

			dbContext.Technologys.Remove(existingTechnology);
			await dbContext.SaveChangesAsync();
			return existingTechnology;
		}

		public async Task<List<Technology>> GetByIdsAsync(IEnumerable<Guid> ids)
		{
			var technologyIds = ids.Distinct().ToList();

			return await dbContext.Technologys
				.Where(technology => technologyIds.Contains(technology.Id)).ToListAsync();
		}
	}
}

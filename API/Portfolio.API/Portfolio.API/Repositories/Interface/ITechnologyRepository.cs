using Portfolio.API.Models.Domain;

namespace Portfolio.API.Repositories.Interface
{
	public interface ITechnologyRepository
	{
		Task<Technology> CreateAsync(Technology technology);

		Task<IEnumerable<Technology>> GetAllAsync();

		Task<Technology?> GetByIdAsync(Guid id);

		Task<Technology?> UpdateAsync(Technology technology);

		Task<Technology?> DeleteAsync(Guid id);

		Task<List<Technology>> GetByIdsAsync(IEnumerable<Guid> ids);
	}
}

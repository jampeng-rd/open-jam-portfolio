using Microsoft.EntityFrameworkCore;
using Portfolio.API.Models.Domain;


namespace Portfolio.API.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
		{
		}

		public DbSet<PortfolioProject> Portfolios { get; set; }
		public DbSet<Technology> Technologys { get; set; }
		public DbSet<PortfolioImage> PortfolioImages { get; set; }
	}
}

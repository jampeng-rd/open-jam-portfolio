using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.Domain
{
	public class Technology
	{
		public Guid Id { get; set; }

		[Required]
		[MaxLength(100)]
		public string Name { get; set; } = string.Empty;

		[MaxLength(2048)]
		public string? IconUrl { get; set; }

		public ICollection<PortfolioProject> PortfolioProjects { get; set; } = new List<PortfolioProject>();
	}
}

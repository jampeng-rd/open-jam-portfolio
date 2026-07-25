using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.Domain
{
	public class PortfolioProject
	{
		public Guid Id { get; set; }

		[Required]
		public string Name { get; set; } = string.Empty;

		[Required]
		public string ShortDescription { get; set; } = string.Empty;

		[Required]
		public string Description { get; set; } = string.Empty;

		[Required]
		[MaxLength(2048)]
		public string ImageUrl { get; set; } = string.Empty;

		[MaxLength(500)]
		public string? GitHubUrl { get; set; }

		[MaxLength(500)]
		public string? GitLabUrl { get; set; }

		[MaxLength(500)]
		public string? DemoUrl { get; set; }

		[MaxLength(2048)]
		public string? VideoUrl { get; set; }

		[MaxLength(2048)]
		public string? PdfUrl { get; set; }

		public bool IsVisible { get; set; }

		public ICollection<Technology> Technologies { get; set; } = new List<Technology>();
	}
}

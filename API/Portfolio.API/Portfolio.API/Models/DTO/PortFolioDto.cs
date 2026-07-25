using Portfolio.API.Models.Domain;
using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.DTO
{
	public class PortFolioDto
	{
		public Guid Id { get; set; }

		public string Name { get; set; } = string.Empty;

		public string ShortDescription { get; set; } = string.Empty;

		public string Description { get; set; } = string.Empty;

		public string ImageUrl { get; set; } = string.Empty;

		public string? GitHubUrl { get; set; }

		public string? GitLabUrl { get; set; }

		public string? DemoUrl { get; set; }

		public string? VideoUrl { get; set; }

		public string? PdfUrl { get; set; }

		public bool IsVisible { get; set; }

		public List<TechnologyDto> Technologies { get; set; } = new List<TechnologyDto>();
	}
}

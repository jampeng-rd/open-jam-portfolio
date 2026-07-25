using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.DTO
{
	public class TechnologyDto
	{
		public Guid Id { get; set; }

		public string Name { get; set; } = string.Empty;

		public string? IconUrl { get; set; }
	}
}

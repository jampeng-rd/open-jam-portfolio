using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.DTO
{
	public class UpdateTechnologyRequestDto
	{
		public string Name { get; set; } = string.Empty;

		public string? IconUrl { get; set; }
	}
}

namespace Portfolio.API.Models.DTO
{
	public class PortfolioImageDto
	{
		public Guid Id { get; set; }

		public string FileName { get; set; } = string.Empty;

		public string FileExtension { get; set; } = string.Empty;

		public string Url { get; set; } = string.Empty;

		public DateTime DateCreated { get; set; }
	}
}

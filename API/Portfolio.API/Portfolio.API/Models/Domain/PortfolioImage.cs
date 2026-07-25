using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.Domain
{
	public class PortfolioImage
	{
		public Guid Id { get; set; }

		[Required]
		[MaxLength(255)]
		public string FileName { get; set; } = string.Empty;

		// 圖片副檔名，例如 .jpg、.png
		[Required]
		[MaxLength(20)]
		public string FileExtension { get; set; } = string.Empty;

		[Required]
		[MaxLength(2048)]
		public string Url { get; set; } = string.Empty;

		public DateTime DateCreated { get; set; } = DateTime.UtcNow;
	}
}

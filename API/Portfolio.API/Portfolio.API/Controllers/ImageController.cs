using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Models.Domain;
using Portfolio.API.Models.DTO;
using Portfolio.API.Repositories.Interface;

namespace Portfolio.API.Controllers
{
	// https://localhost:xxxx/api/image
	[Route("api/[controller]")]
	[ApiController]
	public class ImageController : ControllerBase
	{
		private const long MaxFileSize = 10 * 1024 * 1024; // 10 MB

		private static readonly string[] AllowedExtensions =
		{
			".jpg",
			".jpeg",
			".png",
			".webp"
		};

		private static readonly string[] AllowedContentTypes =
		{
			"image/jpeg",
			"image/png",
			"image/webp"
		};

		private readonly IImageRepository imageRepository;

		public ImageController(IImageRepository imageRepository)
		{
			this.imageRepository = imageRepository;
		}

		[Authorize(Roles = "Writer")]
		[HttpPost]
		[Consumes("multipart/form-data")]
		public async Task<IActionResult> UploadImage(IFormFile? file, [FromForm] string? fileName)
		{
			ValidateFileUpload(file, fileName);

			if (!ModelState.IsValid)
			{
				return ValidationProblem(ModelState);
			}

			// 經過上面的 ModelState 驗證後，file 和 fileName 已確定有值。
			var fileExtension = Path.GetExtension(file!.FileName).ToLowerInvariant();

			// File upload
			var portfolioImage = new PortfolioImage
			{
				FileName = fileName!.Trim(),
				FileExtension = fileExtension,
				DateCreated = DateTime.UtcNow
			};

			portfolioImage = await imageRepository.UploadAsync(file, portfolioImage);

			// Convert Domain model to DTO
			var response = new PortfolioImageDto
			{
				Id = portfolioImage.Id,
				FileName = portfolioImage.FileName,
				FileExtension = portfolioImage.FileExtension,
				Url = portfolioImage.Url,
				DateCreated = portfolioImage.DateCreated,
			};

			return Ok(response);
		}

		// 驗證照片
		private void ValidateFileUpload(IFormFile? file, string? fileName)
		{
			if (string.IsNullOrWhiteSpace(fileName))
			{
				ModelState.AddModelError(
					"fileName",
					"請輸入圖片名稱。"
				);
			}
			else if (fileName.Trim().Length > 255)
			{
				ModelState.AddModelError(
					"fileName",
					"圖片名稱不可超過 255 個字元。"
				);
			}

			if (file is null)
			{
				ModelState.AddModelError(
					"file",
					"請選擇要上傳的圖片。"
				);

				return;
			}

			if (file.Length == 0)
			{
				ModelState.AddModelError(
					"file",
					"圖片內容不可為空。"
				);
			}

			if (file.Length > MaxFileSize)
			{
				ModelState.AddModelError(
					"file",
					"圖片大小不可超過 10 MB。"
				);
			}

			var fileExtension = Path
				.GetExtension(file.FileName)
				.ToLowerInvariant();

			if (!AllowedExtensions.Contains(fileExtension))
			{
				ModelState.AddModelError(
					"file",
					"只允許 JPG、JPEG、PNG 或 WebP 圖片。"
				);
			}

			if (!AllowedContentTypes.Contains(file.ContentType))
			{
				ModelState.AddModelError(
					"file",
					"圖片的內容類型不正確。"
				);
			}
		}

		[HttpGet]
		public async Task<IActionResult> GetAllImages()
		{
			var portfolioImages = await imageRepository.GetAllAsync();

			// Convert Domain model to DTO
			var response = new List<PortfolioImageDto>();

			foreach (var portfolioImage in portfolioImages)
			{
				response.Add(new PortfolioImageDto
				{
					Id = portfolioImage.Id,
					FileName = portfolioImage.FileName,
					FileExtension = portfolioImage.FileExtension,
					Url = portfolioImage.Url,
					DateCreated = portfolioImage.DateCreated,
				});
			}

			return Ok(response);
		}

		[Authorize(Roles = "Writer")]
		[HttpDelete]
		[Route("{id:Guid}")]
		public async Task<IActionResult> DeleteImage(Guid id)
		{
			var deletedImage = await imageRepository.DeleteAsync(id);

			if (deletedImage is null)
			{
				return NotFound(new
				{
					message = "找不到指定的圖片。"
				});
			}

			return NoContent();
		}


	}
}

using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Models.Domain;
using Portfolio.API.Repositories.Interface;

namespace Portfolio.API.Repositories.Implementation
{
	public class ImageRepository: IImageRepository
	{
		private readonly ApplicationDbContext dbContext;
		private readonly IWebHostEnvironment webHostEnvironment;
		private readonly IHttpContextAccessor httpContextAccessor;

		public ImageRepository(
			ApplicationDbContext dbContext,
			IWebHostEnvironment webHostEnvironment,
			IHttpContextAccessor httpContextAccessor)
		{
			this.dbContext = dbContext;
			this.webHostEnvironment = webHostEnvironment;
			this.httpContextAccessor = httpContextAccessor;
		}


		public async Task<PortfolioImage> UploadAsync(IFormFile file, PortfolioImage portfolioImage)
		{
			
            // WebRootPath 預設會指向： Portfolio.API/wwwroot
			var webRootPath = webHostEnvironment.WebRootPath;

            // 某些情況下，如果 wwwroot 還不存在，WebRootPath 可能沒有值，因此提供備用路徑。
			if (string.IsNullOrWhiteSpace(webRootPath))
			{
				webRootPath = Path.Combine(
					webHostEnvironment.ContentRootPath,
					"wwwroot"
				);
			}

			// 最後圖片資料夾： Portfolio.API/wwwroot/Images
			var imagesFolderPath = Path.Combine(
				webRootPath,
				"Images"
			);

			// 若資料夾不存在就自動建立
			Directory.CreateDirectory(imagesFolderPath);


            // 不直接使用前端傳入的 fileName 當實體檔名，避免同名檔案互相覆蓋。
            // 例如：7d2d49217fc44921aa78aa32304d843c.jpg
			var storedFileName =
				$"{Guid.NewGuid():N}{portfolioImage.FileExtension}";

			var localFilePath = Path.Combine(
				imagesFolderPath,
				storedFileName
			);

			try
			{
				// 將圖片儲存到 wwwroot/Images
				await using (var stream = new FileStream(
					localFilePath,
					FileMode.CreateNew,
					FileAccess.Write,
					FileShare.None))
				{
					await file.CopyToAsync(stream);
				}

				var httpContext = httpContextAccessor.HttpContext;

				if (httpContext is null)
				{
					throw new InvalidOperationException("無法取得目前的 HTTP Context。");
				}

				var request = httpContext.Request;

                // 產生圖片網址： https://localhost:7262/Images/xxx.jpg
				portfolioImage.Url =
					$"{request.Scheme}://{request.Host}" +
					$"{request.PathBase}/Images/{storedFileName}";

				await dbContext.PortfolioImages.AddAsync(portfolioImage);
				await dbContext.SaveChangesAsync();

				return portfolioImage;
			}
			catch
			{
                // 如果圖片已寫入硬碟，但資料庫儲存失敗，就刪除該圖片，避免留下沒有資料庫紀錄的檔案。
				if (File.Exists(localFilePath))
				{
					File.Delete(localFilePath);
				}

				throw;
			}

		}

		public async Task<IEnumerable<PortfolioImage>> GetAllAsync()
		{
			return await dbContext.PortfolioImages
				.AsNoTracking()
				.OrderByDescending(image => image.DateCreated)
				.ToListAsync();
		}

		public async Task<PortfolioImage?> DeleteAsync(Guid id)
		{
			var portfolioImage = await dbContext.PortfolioImages.FirstOrDefaultAsync(image => image.Id == id);

			if (portfolioImage is null)
			{
				return null;
			}

			// portfolioImage.Url 範例：https://localhost:7262/Images/7d2d49217fc44921aa78aa32304d843c.jpg
			// 先取得網址中的實體檔名：7d2d49217fc44921aa78aa32304d843c.jpg
			var imageUri = new Uri(portfolioImage.Url);
			var storedFileName = Path.GetFileName(imageUri.LocalPath);

			var webRootPath = webHostEnvironment.WebRootPath;

			if (string.IsNullOrWhiteSpace(webRootPath))
			{
				webRootPath = Path.Combine(webHostEnvironment.ContentRootPath, "wwwroot");
			}

			// 圖片實際位置： Portfolio.API/wwwroot/Images/xxx.jpg
			var localFilePath = Path.Combine(
				webRootPath,
				"Images",
				storedFileName
			);

			// 刪除實體圖片
			if (File.Exists(localFilePath))
			{
				File.Delete(localFilePath);
			}

			// 刪除資料庫紀錄
			dbContext.PortfolioImages.Remove(portfolioImage);
			await dbContext.SaveChangesAsync();

			return portfolioImage;
		}


	}
}

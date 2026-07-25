using Microsoft.AspNetCore.Identity;

namespace Portfolio.API.Data
{
	public static class IdentitySeeder
	{
		public static async Task SeedAdminUserAsync(
			IServiceProvider serviceProvider,
			IConfiguration configuration)
		{
			using var scope = serviceProvider.CreateScope();

			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

			var userName = configuration["AdminUser:UserName"];
			var email = configuration["AdminUser:Email"];
			var password = configuration["AdminUser:Password"];

			if (string.IsNullOrWhiteSpace(userName))
			{
				throw new InvalidOperationException("尚未設定 AdminUser:UserName");
			}

			if (string.IsNullOrWhiteSpace(email))
			{
				throw new InvalidOperationException("尚未設定 AdminUser:Email");
			}

			if (string.IsNullOrWhiteSpace(password))
			{
				throw new InvalidOperationException("尚未設定 AdminUser:Password");
			}

			// 使用登入帳號尋找管理員
			var adminUser = await userManager.FindByNameAsync(userName);

			// 管理員不存在時才建立
			if (adminUser is null)
			{
				adminUser = new IdentityUser
				{
					UserName = userName,
					Email = email,
					EmailConfirmed = true
				};

				var createResult = await userManager.CreateAsync(
					adminUser,
					password);

				if (!createResult.Succeeded)
				{
					var errors = string.Join(
						", ",
						createResult.Errors.Select(error => error.Description));

					throw new InvalidOperationException($"建立管理員失敗：{errors}");
				}
			}

			// 指派 Reader 角色
			if (!await userManager.IsInRoleAsync(adminUser, "Reader"))
			{
				var readerResult = await userManager.AddToRoleAsync(adminUser, "Reader");

				if (!readerResult.Succeeded)
				{
					var errors = string.Join(
						", ",
						readerResult.Errors.Select(error => error.Description));

					throw new InvalidOperationException($"指派 Reader 角色失敗：{errors}");
				}
			}

			// 指派 Writer 角色
			if (!await userManager.IsInRoleAsync(adminUser, "Writer"))
			{
				var writerResult = await userManager.AddToRoleAsync(adminUser, "Writer");

				if (!writerResult.Succeeded)
				{
					var errors = string.Join(
						", ",
						writerResult.Errors.Select(error => error.Description));

					throw new InvalidOperationException($"指派 Writer 角色失敗：{errors}");
				}
			}

		}
	}
}

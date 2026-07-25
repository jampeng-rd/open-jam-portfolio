using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Portfolio.API.Models.DTO;
using Portfolio.API.Repositories.Interface;
using System.Security.Claims;

namespace Portfolio.API.Controllers
{
	// https://localhost:xxxx/api/auth
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<IdentityUser> userManager;
		private readonly ITokenRepository tokenRepository;

		public AuthController(
			UserManager<IdentityUser> userManager,
			ITokenRepository tokenRepository)
		{
			this.userManager = userManager;
			this.tokenRepository = tokenRepository;
		}

		[HttpPost]
		[Route("login")]
		public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
		{
			// 尋找使用者
			var user = await userManager.FindByNameAsync(request.UserName);

			if (user is null)
			{
				return Unauthorized(new
				{
					message = "帳號或密碼錯誤"
				});
			}

			// 驗證密碼
			var isPasswordValid = await userManager.CheckPasswordAsync(user, request.Password);

			if (!isPasswordValid)
			{
				return Unauthorized(new
				{
					message = "帳號或密碼錯誤"
				});
			}

			// 取得使用者角色
			var roles = await userManager.GetRolesAsync(user);

			// 產生 JWT
			var token = tokenRepository.CreateJwtToken(user, roles.ToList());

			var response = new LoginResponseDto
			{
				UserName = user.UserName ?? string.Empty,
				Email = user.Email ?? string.Empty,
				Roles = roles.ToList(),
				Token = token
			};

			return Ok(response);
		}

		[Authorize]
		[HttpGet("me")]
		public ActionResult<CurrentUserResponseDto> GetCurrentUser()
		{

			var response = new CurrentUserResponseDto
			{
				UserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty,

				UserName = User.Identity?.Name ?? string.Empty,

				Email = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty,

				Roles = User.FindAll(ClaimTypes.Role)
					.Select(claim => claim.Value)
					.ToList()
			};

			return Ok(response);
		}

	}
}

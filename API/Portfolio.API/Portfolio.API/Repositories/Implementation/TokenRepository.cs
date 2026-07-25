using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Portfolio.API.Repositories.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portfolio.API.Repositories.Implementation
{
	public class TokenRepository: ITokenRepository
	{
		private readonly IConfiguration configuration;

		public TokenRepository(IConfiguration configuration)
		{
			this.configuration = configuration;
		}

		public string CreateJwtToken(IdentityUser user, List<string> roles)
		{
			var jwtIssuer = configuration["Jwt:Issuer"];
			var jwtAudience = configuration["Jwt:Audience"];
			var jwtKey = configuration["Jwt:Key"];

			var expiryMinutesValue =
				configuration["Jwt:ExpiryMinutes"];

			if (string.IsNullOrWhiteSpace(jwtIssuer))
			{
				throw new InvalidOperationException("尚未設定 Jwt:Issuer");
			}

			if (string.IsNullOrWhiteSpace(jwtAudience))
			{
				throw new InvalidOperationException("尚未設定 Jwt:Audience");
			}

			if (string.IsNullOrWhiteSpace(jwtKey))
			{
				throw new InvalidOperationException("尚未設定 Jwt:Key");
			}

			if (!int.TryParse(expiryMinutesValue, out var expiryMinutes))
			{
				throw new InvalidOperationException("Jwt:ExpiryMinutes 必須是有效整數");
			}

			var claims = new List<Claim>
			{
				new Claim(
					ClaimTypes.NameIdentifier,
					user.Id
				),

				new Claim(
					ClaimTypes.Name,
					user.UserName ?? string.Empty
				),

				new Claim(
					ClaimTypes.Email,
					user.Email ?? string.Empty
				)
			};

			foreach (var role in roles)
			{
				claims.Add(
					new Claim(ClaimTypes.Role, role)
				);
			}

			var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

			var signingCredentials = 
				new SigningCredentials(
					signingKey,
					SecurityAlgorithms.HmacSha256
				);

			var token = new JwtSecurityToken(
				issuer: jwtIssuer,
				audience: jwtAudience,
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
				signingCredentials: signingCredentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

	}
}

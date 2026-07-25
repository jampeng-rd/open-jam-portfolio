using Microsoft.AspNetCore.Identity;

namespace Portfolio.API.Repositories.Interface
{
	public interface ITokenRepository
	{
		string CreateJwtToken(IdentityUser user, List<string> roles);
	}
}

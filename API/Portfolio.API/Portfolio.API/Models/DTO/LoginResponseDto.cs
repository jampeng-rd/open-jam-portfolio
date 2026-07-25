namespace Portfolio.API.Models.DTO
{
	public class LoginResponseDto
	{
		public string UserName { get; set; } = string.Empty;

		public string Email { get; set; } = string.Empty;

		public List<string> Roles { get; set; } = [];

		public string Token { get; set; } = string.Empty;
	}
}

using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Models.DTO
{
	public class LoginRequestDto
	{
		[Required(ErrorMessage = "請輸入帳號")]
		[MaxLength(256)]
		public string UserName { get; set; } = string.Empty;

		[Required(ErrorMessage = "請輸入密碼")]
		[MaxLength(100)]
		public string Password { get; set; } = string.Empty;
	}
}

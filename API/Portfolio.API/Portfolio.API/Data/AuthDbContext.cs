using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Portfolio.API.Data
{
	public class AuthDbContext: IdentityDbContext
	{
		public AuthDbContext(DbContextOptions<AuthDbContext> options): base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			// Create Reader and Writer Role (建立角色)
			var readerRoleId = "1e46e11b-5650-4da5-a84e-39462322e3fa";
			var writerRoleId = "ff6d5c76-9942-4546-aac3-ad0b477ff68c";

			var roles = new List<IdentityRole>
			{
				new IdentityRole()
				{
					Id = readerRoleId,
					Name = "Reader",
					NormalizedName = "READER",
					ConcurrencyStamp = readerRoleId,
				},
				new IdentityRole()
				{
					Id = writerRoleId,
					Name = "Writer",
					NormalizedName = "WRITER",
					ConcurrencyStamp = writerRoleId,
				},
			};

			// Seed the roles (將固定角色加入 Seed Data)
			builder.Entity<IdentityRole>().HasData(roles);

		}
	}
}

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Portfolio.API.Data;
using Portfolio.API.Repositories.Implementation;
using Portfolio.API.Repositories.Interface;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// ImageRepository 需要透過它取得目前請求的網址
builder.Services.AddHttpContextAccessor();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.AddSecurityDefinition(
		"Bearer",
		new OpenApiSecurityScheme
		{
			Name = "Authorization",
			Type = SecuritySchemeType.Http,
			Scheme = "Bearer",
			BearerFormat = "JWT",
			In = ParameterLocation.Header,
			Description = "請輸入 JWT Token"
		});

	options.AddSecurityRequirement(
		new OpenApiSecurityRequirement
		{
			{
				new OpenApiSecurityScheme
				{
					Reference = new OpenApiReference
					{
						Type = ReferenceType.SecurityScheme,
						Id = "Bearer"
					}
				},
				Array.Empty<string>()
			}
		});
});

// Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
	options.UseSqlServer(builder.Configuration.GetConnectionString("PortfolioConnectionString"));
});

builder.Services.AddDbContext<AuthDbContext>(options =>
{
	options.UseSqlServer(builder.Configuration.GetConnectionString("AuthConnectionString"));
});

// Register Repository Pattern
builder.Services.AddScoped<ITechnologyRepository, TechnologyRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();

// Identity 的預設 Token Provider 需要 Data Protection
builder.Services.AddDataProtection();

// 註冊 Identity 並設定密碼規則
builder.Services
	.AddIdentityCore<IdentityUser>(options =>
	{
		options.Password.RequiredLength = 8;
		options.Password.RequireDigit = true;
		options.Password.RequireLowercase = true;
		options.Password.RequireUppercase = true;
		options.Password.RequireNonAlphanumeric = true;
		options.User.RequireUniqueEmail = true;
	})
	.AddRoles<IdentityRole>()
	.AddEntityFrameworkStores<AuthDbContext>()
	.AddDefaultTokenProviders();

// 讀取 JWT 設定
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var jwtKey = builder.Configuration["Jwt:Key"];

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

// 註冊 JWT Authentication
builder.Services
	.AddAuthentication(options =>
	{
		options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	})
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,

				ValidIssuer = jwtIssuer,
				ValidAudience = jwtAudience,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

				ClockSkew = TimeSpan.Zero
			};
	});


// Register CORS Policy
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAngular", policy =>
	{
		policy.WithOrigins("http://localhost:4200")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	}
	);
});

var app = builder.Build();

// 建立預設管理員帳號並指派角色
await IdentitySeeder.SeedAdminUserAsync(
	app.Services,
	app.Configuration);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 讓 wwwroot 內的靜態檔案可以透過網址讀取
app.UseStaticFiles();

// Using CORS Policy - "AllowAngular"
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

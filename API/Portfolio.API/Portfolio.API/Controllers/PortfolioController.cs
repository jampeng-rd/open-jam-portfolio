using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Models.Domain;
using Portfolio.API.Models.DTO;
using Portfolio.API.Repositories.Interface;

namespace Portfolio.API.Controllers
{
	// https://localhost:xxxx/api/portfolio
	[Route("api/[controller]")]
	[ApiController]
	public class PortfolioController : ControllerBase
	{
		private readonly IPortfolioRepository portfolioRepository;
		private readonly ITechnologyRepository technologyRepository;

		public PortfolioController(
			IPortfolioRepository portfolioRepository,
			ITechnologyRepository technologyRepository)
		{
			this.portfolioRepository = portfolioRepository;
			this.technologyRepository = technologyRepository;
		}

		[Authorize(Roles = "Writer")]
		[HttpPost]
		public async Task<IActionResult> CreatePortFolio([FromBody] CreatePortFolioRequestDto request)
		{

			var requestedTechnologyIds = request.Technologies.Distinct().ToList();

			var technologies = await technologyRepository.GetByIdsAsync(requestedTechnologyIds);

			if (technologies.Count != requestedTechnologyIds.Count)
			{
				return BadRequest(new
				{
					message = "有一個或多個技術 ID 不存在。"
				});
			}

			// Convert DTO to Domain Model
			var portFolio = new PortfolioProject
			{
				Name = request.Name,
				ShortDescription = request.ShortDescription,
				Description = request.Description,
				ImageUrl = request.ImageUrl,
				GitHubUrl = request.GitHubUrl,
				GitLabUrl = request.GitLabUrl,
				DemoUrl = request.DemoUrl,
				VideoUrl = request.VideoUrl,
				PdfUrl = request.PdfUrl,
				IsVisible = request.IsVisible,
				Technologies = technologies,
			};

			portFolio = await portfolioRepository.CreateAsync(portFolio);

			// Convert Domain model to DTO
			var response = new PortFolioDto
			{
				Id = portFolio.Id,
				Name = portFolio.Name,
				ShortDescription = portFolio.ShortDescription,
				Description = portFolio.Description,
				ImageUrl = portFolio.ImageUrl,
				GitHubUrl = portFolio.GitHubUrl,
				GitLabUrl = portFolio.GitLabUrl,
				DemoUrl = portFolio.DemoUrl,
				VideoUrl = portFolio.VideoUrl,
				PdfUrl = portFolio.PdfUrl,
				IsVisible = portFolio.IsVisible,
				Technologies = portFolio.Technologies.Select(x => new TechnologyDto
				{
					Id = x.Id,
					Name = x.Name,
					IconUrl = x.IconUrl,
				}).ToList()
			};

			return Ok(response);
		}

		[HttpGet]
		public async Task<IActionResult> GetAllPortfolio()
		{
			var portfolios = await portfolioRepository.GetAllAsync();

			// Convert Domain model to DTO
			var response = new List<PortFolioDto>();
			foreach (var portfolio in portfolios)
			{
				response.Add(new PortFolioDto
				{
					Id = portfolio.Id,
					Name = portfolio.Name,
					ShortDescription = portfolio.ShortDescription,
					Description = portfolio.Description,
					ImageUrl = portfolio.ImageUrl,
					GitHubUrl = portfolio.GitHubUrl,
					GitLabUrl = portfolio.GitLabUrl,
					DemoUrl = portfolio.DemoUrl,
					VideoUrl = portfolio.VideoUrl,
					PdfUrl = portfolio.PdfUrl,
					IsVisible = portfolio.IsVisible,
					Technologies = portfolio.Technologies.Select(x => new TechnologyDto
					{
						Id = x.Id,
						Name = x.Name,
						IconUrl = x.IconUrl,
					}).ToList()
				});
			}

			return Ok(response);
		}

		[HttpGet]
		[Route("{id:Guid}")]
		public async Task<IActionResult> GetPortfolioById([FromRoute] Guid id)
		{
			var existingPortfolio = await portfolioRepository.GetByIdAsync(id);

			if (existingPortfolio == null) { return NotFound(); }

			// Convert Domain model to DTO
			var response = new PortFolioDto
			{
				Id = existingPortfolio.Id,
				Name = existingPortfolio.Name,
				ShortDescription = existingPortfolio.ShortDescription,
				Description = existingPortfolio.Description,
				ImageUrl = existingPortfolio.ImageUrl,
				GitHubUrl = existingPortfolio.GitHubUrl,
				GitLabUrl = existingPortfolio.GitLabUrl,
				DemoUrl = existingPortfolio.DemoUrl,
				VideoUrl = existingPortfolio.VideoUrl,
				PdfUrl = existingPortfolio.PdfUrl,
				IsVisible = existingPortfolio.IsVisible,
				Technologies = existingPortfolio.Technologies.Select(x => new TechnologyDto
				{
					Id = x.Id,
					Name = x.Name,
					IconUrl = x.IconUrl,
				}).ToList()
			};

			return Ok(response);
		}

		[Authorize(Roles = "Writer")]
		[HttpPut]
		[Route("{id:Guid}")]
		public async Task<IActionResult> UpdatePortfolio([FromRoute] Guid id, [FromBody] UpdatePortFolioRequestDto request)
		{
			// Convert DTO to Domain Model
			var portFolio = new PortfolioProject
			{
				Id = id,
				Name = request.Name,
				ShortDescription = request.ShortDescription,
				Description = request.Description,
				ImageUrl = request.ImageUrl,
				GitHubUrl = request.GitHubUrl,
				GitLabUrl = request.GitLabUrl,
				DemoUrl = request.DemoUrl,
				VideoUrl = request.VideoUrl,
				PdfUrl = request.PdfUrl,
				IsVisible = request.IsVisible,
				Technologies = new List<Technology>(),
			};

			foreach (var technologyGuid in request.Technologies)
			{
				var existingTechnology = await technologyRepository.GetByIdAsync(technologyGuid);
				if (existingTechnology is not null)
				{
					portFolio.Technologies.Add(existingTechnology);
				}
			}

			var updatePortfolio = await portfolioRepository.UpdateAsync(portFolio);
			if (updatePortfolio == null)
			{
				return NotFound();
			}

			// Convert Domain model to DTO
			var response = new PortFolioDto
			{
				Id = updatePortfolio.Id,
				Name = updatePortfolio.Name,
				ShortDescription = updatePortfolio.ShortDescription,
				Description = updatePortfolio.Description,
				ImageUrl = updatePortfolio.ImageUrl,
				GitHubUrl = updatePortfolio.GitHubUrl,
				GitLabUrl = updatePortfolio.GitLabUrl,
				DemoUrl = updatePortfolio.DemoUrl,
				VideoUrl = updatePortfolio.VideoUrl,
				PdfUrl = updatePortfolio.PdfUrl,
				IsVisible = updatePortfolio.IsVisible,
				Technologies = updatePortfolio.Technologies.Select(x => new TechnologyDto
				{
					Id = x.Id,
					Name = x.Name,
					IconUrl = x.IconUrl,
				}).ToList()
			};
			
			return Ok(response);
		}

		[Authorize(Roles = "Writer")]
		[HttpDelete]
		[Route("{id:Guid}")]
		public async Task<IActionResult> DeletePortfolio([FromRoute] Guid id)
		{
			var portfolio = await portfolioRepository.DeleteAsync(id);

			if (portfolio == null) return NotFound();

			// Convert Domain Model to DTO
			var response = new PortFolioDto
			{
				Id = portfolio.Id,
				Name = portfolio.Name,
				ShortDescription = portfolio.ShortDescription,
				Description = portfolio.Description,
				ImageUrl = portfolio.ImageUrl,
				GitHubUrl = portfolio.GitHubUrl,
				GitLabUrl = portfolio.GitLabUrl,
				DemoUrl = portfolio.DemoUrl,
				VideoUrl = portfolio.VideoUrl,
				PdfUrl = portfolio.PdfUrl,
				IsVisible = portfolio.IsVisible,
			};

			return Ok(response);
		}

		[HttpGet]
		[Route("{url}")]
		public async Task<IActionResult> GetPortfolioByUrl([FromRoute] string url)
		{
			var existingPortfolio = await portfolioRepository.GetByUrlAsync(url);

			if (existingPortfolio == null) return NotFound();

			// Convert Domain model to DTO
			var response = new PortFolioDto
			{
				Id = existingPortfolio.Id,
				Name = existingPortfolio.Name,
				ShortDescription = existingPortfolio.ShortDescription,
				Description = existingPortfolio.Description,
				ImageUrl = existingPortfolio.ImageUrl,
				GitHubUrl = existingPortfolio.GitHubUrl,
				GitLabUrl = existingPortfolio.GitLabUrl,
				DemoUrl = existingPortfolio.DemoUrl,
				VideoUrl = existingPortfolio.VideoUrl,
				PdfUrl = existingPortfolio.PdfUrl,
				IsVisible = existingPortfolio.IsVisible,
				Technologies = existingPortfolio.Technologies.Select(x => new TechnologyDto
				{
					Id = x.Id,
					Name = x.Name,
					IconUrl = x.IconUrl,
				}).ToList()
			};

			return Ok(response);
		}

		// 首頁專用限制顯示作品數量 GET: /api/portfolio/home?count=6  
		[HttpGet("home-preview")]
		public async Task<ActionResult<List<PortFolioDto>>> GetHomePortfolios([FromQuery] int count = 6)
		{
			if (count <= 0)
			{
				return BadRequest(new
				{
					message = "count 必須大於 0。"
				});
			}

			if (count > 12)
			{
				return BadRequest(new
				{
					message = "count 不可超過 12。"
				});
			}

			var portfolios = await portfolioRepository.GetHomePortfoliosAsync(count);

			var response = portfolios.Select(portfolio => new PortFolioDto
			{
				Id = portfolio.Id,
				Name = portfolio.Name,
				ShortDescription = portfolio.ShortDescription,
				Description = portfolio.Description,
				ImageUrl = portfolio.ImageUrl,
				GitHubUrl = portfolio.GitHubUrl,
				GitLabUrl = portfolio.GitLabUrl,
				DemoUrl = portfolio.DemoUrl,
				VideoUrl = portfolio.VideoUrl,
				PdfUrl = portfolio.PdfUrl,
				IsVisible = portfolio.IsVisible,
				Technologies = portfolio.Technologies.Select(technology => new TechnologyDto
				{
					Id = technology.Id,
					Name = technology.Name,
					IconUrl = technology.IconUrl
				}).ToList()
			}).ToList();

			return Ok(response);
		}

	}
}

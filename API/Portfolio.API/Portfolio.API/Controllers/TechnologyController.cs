using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Models.Domain;
using Portfolio.API.Models.DTO;
using Portfolio.API.Repositories.Interface;

namespace Portfolio.API.Controllers
{
	// https://localhost:xxxx/api/technology
	[Route("api/[controller]")]
	[ApiController]
	public class TechnologyController : ControllerBase
	{
		private readonly ITechnologyRepository technologyRepository;

		public TechnologyController(ITechnologyRepository technologyRepository)
		{
			this.technologyRepository = technologyRepository;
		}

		[Authorize(Roles = "Writer")]
		[HttpPost]
		public async Task<IActionResult> CreateTechnology([FromBody] CreateTechnologyRequestDto request)
		{
			// Convert DTO to Domain Model
			var technology = new Technology
			{
				Name = request.Name,
				IconUrl = request.IconUrl,
			};

			await technologyRepository.CreateAsync(technology);

			// Convert Domain Model to DTO
			var response = new TechnologyDto
			{
				Id = technology.Id,
				Name = technology.Name,
				IconUrl = technology.IconUrl,
			};

			return Ok(response);
		}

		[HttpGet]
		public async Task<IActionResult> GetAllTechnologys()
		{
			var technologys = await technologyRepository.GetAllAsync();

			// Convert Domain Model to DTO
			var response = new List<TechnologyDto>();
			foreach (var technology in technologys)
			{
				response.Add(new TechnologyDto
				{
					Id = technology.Id,
					Name = technology.Name,
					IconUrl = technology.IconUrl,
				});
			}

			return Ok(response);
		}

		[HttpGet]
		[Route("{id:Guid}")]
		public async Task<IActionResult> GetTechnologyById([FromRoute] Guid id)
		{
			var existingTechnology = await technologyRepository.GetByIdAsync(id);

			if (existingTechnology is null)
			{
				return NotFound();
			}

			// Convert Domain Model to DTO
			var response = new TechnologyDto
			{
				Id = existingTechnology.Id,
				Name = existingTechnology.Name,
				IconUrl = existingTechnology.IconUrl,
			};

			return Ok(response);
		}

		[Authorize(Roles = "Writer")]
		[HttpPut]
		[Route("{id:Guid}")]
		public async Task<IActionResult> UpdateTcehnology([FromRoute] Guid id, [FromBody] UpdateTechnologyRequestDto request)
		{
			// Convert DTO to Domain Model
			var technology = new Technology
			{
				Id = id,
				Name = request.Name,
				IconUrl = request.IconUrl,
			};

			technology = await technologyRepository.UpdateAsync(technology);

			if (technology == null)
			{
				return NotFound();
			}

			// Convert Domain Model to DTO
			var response = new TechnologyDto
			{
				Id = technology.Id,
				Name = technology.Name,
				IconUrl = technology.IconUrl,
			};

			return Ok(response);
		}

		[Authorize(Roles = "Writer")]
		[HttpDelete]
		[Route("{id:Guid}")]
		public async Task<IActionResult> DeleteTcehnology([FromRoute] Guid id)
		{
			var technology = await technologyRepository.DeleteAsync(id);

			if (technology is null)
			{
				return NotFound();
			}

			// Convert Domain Model to DTO
			var response = new TechnologyDto
			{
				Id = technology.Id,
				Name = technology.Name,
				IconUrl = technology.IconUrl,
			};

			return Ok(response);
		}

	}
}

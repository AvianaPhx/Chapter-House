using Chapter_House.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using Chapter_House.DTO.Banner;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public BannerController(ApplicationDbContext db)
        {
            dbContext = db;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBanner([FromBody] CreateBannerDto bannerDto)
        {
            if (bannerDto == null)
            {
                return BadRequest("Invalid banner data.");
            }

            var banner = new Banner
            {
                Title = bannerDto.Title,
                Message = bannerDto.Message,
                Starts = bannerDto.Starts,
                Ends = bannerDto.Ends
            };

            dbContext.Banners.Add(banner);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBannerById), new { id = banner.Id }, banner);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetBannerById(int id)
        {
            var banner = await dbContext.Banners.FindAsync(id);

            if (banner == null)
            {
                return NotFound("Banner not found.");
            }

            var bannerDto = new BannerDto
            {
                Id = banner.Id,
                Title = banner.Title,
                Message = banner.Message,
                Starts = banner.Starts,
                Ends = banner.Ends,
                IsActive = banner.IsActive
            };

            return Ok(bannerDto);
        }


        [HttpGet("active")]
        public IActionResult GetActiveBanners()
        {
            var activeBanners = dbContext.Banners
                                          .AsEnumerable() 
                                          .Where(b => b.IsActive) 
                                          .Select(b => new BannerDto
                                          {
                                              Id = b.Id,
                                              Title = b.Title,
                                              Message = b.Message,
                                              Starts = b.Starts,
                                              Ends = b.Ends,
                                              IsActive = b.IsActive
                                          })
                                          .ToList();

            return Ok(activeBanners);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBanner(int id, [FromBody] UpdateBannerDto updatedBannerDto)
        {
            var existingBanner = await dbContext.Banners.FindAsync(id);

            if (existingBanner == null)
            {
                return NotFound("Banner not found.");
            }

            existingBanner.Title = updatedBannerDto.Title;
            existingBanner.Message = updatedBannerDto.Message;
            existingBanner.Starts = updatedBannerDto.Starts;
            existingBanner.Ends = updatedBannerDto.Ends;

            await dbContext.SaveChangesAsync();

            return Ok(existingBanner);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            var banner = await dbContext.Banners.FindAsync(id);

            if (banner == null)
            {
                return NotFound("Banner not found.");
            }

            dbContext.Banners.Remove(banner);
            await dbContext.SaveChangesAsync();

            return Ok(banner);
        }
    }
}

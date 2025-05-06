using Chapter_House.DTO.Format;
using Chapter_House.DTO.Genre;
using Chapter_House.Entities.Core;
using Chapter_House.Entities.Lookup;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormatController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public FormatController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public IActionResult GetAllFormat()
        {
            var allFormat = dbContext.BookFormats.ToList();

            return Ok(allFormat);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetFormatById(int id)
        {
            var format = dbContext.BookFormats.Find(id);

            if (format is null)
            {
                return NotFound();
            }

            return Ok(format);
        }

        [HttpPost]
        public IActionResult AddFormat(AddFormatDto addFormatDto)
        {
            var formatEntity = new BookFormat
            {
                FormatName = addFormatDto.Format,
                Books = new List<Book>()
            };

            dbContext.BookFormats.Add(formatEntity);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetFormatById), new { id = formatEntity.Id }, formatEntity);
        }
    }
}

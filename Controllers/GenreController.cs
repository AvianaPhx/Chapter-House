using Chapter_House.DTO.Genre;
using Chapter_House.Entities.Core;
using Chapter_House.Entities.Lookup;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public GenreController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public IActionResult GetAllGenre()
        {
            var allGenre = dbContext.BookGenres.ToList();

            return Ok(allGenre);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetGenreById(int id)
        {
            var genre = dbContext.BookGenres.Find(id);

            if ( genre is null)
            {
                return NotFound();
            }

            return Ok(genre);
        }

        [HttpPost]
        public IActionResult AddGenre(AddGenreDto addGenreDto)
        {
            var genreEntity = new BookGenre
            {
                GenreName = addGenreDto.GenreName,
                Books = new List<Book>()
            };

            dbContext.BookGenres.Add(genreEntity);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetGenreById), new { id = genreEntity.Id }, genreEntity);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult UpdateGenre(int id, UpdateGenreDto updateGenreDto)
        {
            var genre = dbContext.BookGenres.Find(id);

            if(genre is null)
            {
                return NotFound();
            }

            genre.GenreName = updateGenreDto.GenreName;

            dbContext.SaveChanges();

            return Ok(genre);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeleteGenre(int id)
        {
            var genre = dbContext.BookGenres.Find(id);

            if(genre is null)
            {
                return NotFound();
            }

            dbContext.BookGenres.Remove(genre);
            dbContext.SaveChanges();

            return Ok(genre);
        }
    }
}

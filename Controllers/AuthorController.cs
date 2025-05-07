using Chapter_House.DTO.Author;
using Chapter_House.Entities.Core;
using Chapter_House.Entities.Lookup;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public AuthorController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public IActionResult GetAllAuthor()
        {
            var allAuthor = dbContext.BookAuthors.ToList();

            return Ok(allAuthor);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetAuthorById(int id)
        {
            var author = dbContext.BookAuthors.Find(id);

            if (author is null)
            {
                return NotFound();
            }

            return Ok(author);
        }

        [HttpPost]
        public IActionResult AddAuthor(AddAuthorDto addAuthorDto)
        {
            var authorEntity = new BookAuthor
            {
                AuthorName = addAuthorDto.AuthorName,
                Books = new List<Book>()
            };

            dbContext.BookAuthors.Add(authorEntity);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetAllAuthor), new { id = authorEntity.Id }, authorEntity);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult UpdateAuthor(int id, UpdateAuthorDto updateAuthorDto)
        {
            var author = dbContext.BookAuthors.Find(id);

            if (author is null)
            {
                return NotFound();
            }

            author.AuthorName = updateAuthorDto.AuthorName;
            dbContext.SaveChanges();
            return Ok(author);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeleteAuthor(int id)
        {
            var author = dbContext.BookAuthors.Find(id);

            if (author is null)
            {
                return NotFound();
            }

            dbContext.BookAuthors.Remove(author);
            dbContext.SaveChanges();

            return Ok(author);
        }
    }
}

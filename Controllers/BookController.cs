using Chapter_House.DTO.Books;
using Chapter_House.Entities.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public BookController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public IActionResult GetAllBooks()
        {
            var allBooks = dbContext.Books.ToList();

            return Ok(allBooks);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetBookById(int id)
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        [HttpPost]
        public IActionResult AddBooks(AddBookDto addBookDto)
        {
            var bookEntity = new Book()
            {
                Title = addBookDto.Title,
                Author = addBookDto.Author,
                ListedAt = addBookDto.ListedAt,
                Price = addBookDto.Price,
                Stock = addBookDto.Stock,
                Published = addBookDto.Published
            };

            dbContext.Books.Add(bookEntity);
            dbContext.SaveChanges();

            return Ok(bookEntity);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult UpdateBooks(int id, UpdateBookDto updateBookDto )
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }

            book.Author = updateBookDto.Author;
            book.Title = updateBookDto.Title;
            book.Price = updateBookDto.Price;
            book.Stock = updateBookDto.Stock;

            dbContext.SaveChanges();

            return Ok(book);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeleteBooks(int id)
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }

            dbContext.Books.Remove(book);
            dbContext.SaveChanges();

            return Ok(book);

        }
    }
}

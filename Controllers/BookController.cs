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
        public IActionResult GetAllBooks([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var allBooks = dbContext.Books
                                    .Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToList();

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
            var genre = dbContext.BookGenres.Find(addBookDto.GenreId);
            var format = dbContext.BookFormats.Find(addBookDto.FormatId);
            var publisher = dbContext.BookPublishers.Find(addBookDto.PublisherId);

            if (genre == null || format == null || publisher == null)
            {
                return NotFound("Genre, Format, or Publisher not found.");
            }

            var bookEntity = new Book()
            {
                Title = addBookDto.Title,
                Author = addBookDto.Author,
                Price = addBookDto.Price,
                Isbn = addBookDto.Isbn,
                Stock = addBookDto.Stock,
                Published = addBookDto.Published,
                DiscountedPrice = addBookDto.DiscountedPrice,
                GenreId = addBookDto.GenreId,
                FormatId = addBookDto.FormatId,
                PublisherId = addBookDto.PublisherId,
                Genre = genre,
                Format = format,
                Publisher = publisher
            };

            dbContext.Books.Add(bookEntity);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetBookById), new { id = bookEntity.Id }, bookEntity);
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

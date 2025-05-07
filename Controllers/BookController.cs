using Chapter_House.DTO.Books;
using Chapter_House.Entities.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public BookController(ApplicationDbContext db) => dbContext = db;



        [HttpGet]
        public IActionResult GetAllBooks([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "")
        {
            var query = dbContext.Books.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b => b.Title.Contains(search) ||
                                 b.Description.Contains(search));
            }

            var allBooks = query
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
            var author = dbContext.BookAuthors.Find(addBookDto.AuthorId);

            if (genre == null)
                return NotFound($"Genre with ID {addBookDto.GenreId} not found.");
            if (format == null)
                return NotFound($"Format with ID {addBookDto.FormatId} not found.");
            if (publisher == null)
                return NotFound($"Publisher with ID {addBookDto.PublisherId} not found.");
            if (author == null)
                return NotFound($"Author with ID {addBookDto.AuthorId} not found.");

            var bookEntity = new Book()
            {
                Title = addBookDto.Title,
                Description = addBookDto.Description,
                Price = addBookDto.Price,
                Isbn = addBookDto.Isbn,
                Stock = addBookDto.Stock,
                OnSale = addBookDto.OnSale,
                Published = addBookDto.Published,
                ListedAt = addBookDto.ListedAt,
                DiscountedPercentage = addBookDto.DiscountedPercentage,
                DiscountStartDate = addBookDto.DiscountStartDate,
                DiscountEndDate = addBookDto.DiscountEndDate,
                Language = addBookDto.Language,
                GenreId = addBookDto.GenreId,
                FormatId = addBookDto.FormatId,
                PublisherId = addBookDto.PublisherId,
                AuthorId = addBookDto.AuthorId,
                Genre = genre,
                Format = format,
                Publisher = publisher,
                Author = author
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

            book.Title = updateBookDto.Title;
            book.Description = updateBookDto.Description;
            book.Price = updateBookDto.Price;
            book.Isbn = updateBookDto.Isbn;
            book.Stock = updateBookDto.Stock;
            book.OnSale = updateBookDto.OnSale;
            book.Published = updateBookDto.Published;
            book.DiscountedPercentage = updateBookDto.DiscountedPercentage;
            book.TotalPrice = updateBookDto.TotalPrice;
            book.DiscountStartDate = updateBookDto.DiscountStartDate;
            book.DiscountEndDate = updateBookDto.DiscountEndDate;
            book.Language = updateBookDto.Language;

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

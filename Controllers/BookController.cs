using Chapter_House.DTO.Books;
using Chapter_House.Entities.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private const int PageSize = 10; // Number of items per page

        public BookController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public async Task<IActionResult> GetAllBooks(
            [FromQuery] string search = "",
            [FromQuery] string category = "",
            [FromQuery] decimal priceMin = 0,
            [FromQuery] decimal priceMax = 1000,
            [FromQuery] string formats = "",
            [FromQuery] string availability = "all",
            [FromQuery] string genres = "",
            [FromQuery] string sortBy = "popularity",
            [FromQuery] int page = 1)
        {
            // First check for expired discounts and update them
            var expiredDiscountBooks = await dbContext.Books
                .Where(b => b.OnSale && b.DiscountEndDate < DateTime.UtcNow)
                .ToListAsync();

            foreach (var book in expiredDiscountBooks)
            {
                book.OnSale = false;
                book.DiscountedPercentage = 0;
            }

            if (expiredDiscountBooks.Any())
            {
                await dbContext.SaveChangesAsync();
            }

            var query = dbContext.Books.AsQueryable();

            // Search functionality
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b =>
                    b.Title.Contains(search) ||
                    b.Description.Contains(search) ||
                    b.Isbn.Contains(search) ||
                    b.AuthorName.Contains(search) ||
                    b.PublisherName.Contains(search));
            }

            // Category filtering
            if (!string.IsNullOrEmpty(category))
            {
                switch (category.ToLower())
                {
                    case "best sellers":
                        query = query.Where(b => b.Rating >= 4);
                        break;
                    case "award winners":
                        query = query.Where(b => b.Rating >= 4.5m);
                        break;
                    case "new releases":
                        query = query.Where(b => b.Published >= DateTime.UtcNow.AddMonths(-3));
                        break;
                    case "new arrivals":
                        query = query.Where(b => b.ListedAt >= DateTime.UtcNow.AddDays(-14));
                        break;
                    case "coming soon":
                        query = query.Where(b => b.Published > DateTime.UtcNow);
                        break;
                    case "deals":
                        query = query.Where(b => b.OnSale &&
                                              b.DiscountStartDate <= DateTime.UtcNow &&
                                              b.DiscountEndDate >= DateTime.UtcNow);
                        break;
                }
            }

            // Price range filtering
            query = query.Where(b => b.Price >= priceMin && b.Price <= priceMax);

            // Format filtering
            if (!string.IsNullOrEmpty(formats))
            {
                var formatList = formats.Split(',').ToList();
                query = query.Where(b => formatList.Contains(b.FormatName));
            }

            // Availability filtering
            if (availability == "in-stock")
            {
                query = query.Where(b => b.Stock > 0);
            }
            else if (availability == "out-of-stock")
            {
                query = query.Where(b => b.Stock <= 0);
            }

            // Genre filtering
            if (!string.IsNullOrEmpty(genres))
            {
                var genreList = genres.Split(',').ToList();
                query = query.Where(b => genreList.Contains(b.GenreName));
            }

            // Sorting
            switch (sortBy.ToLower())
            {
                case "price: low to high":
                    query = query.OrderBy(b => b.Price);
                    break;
                case "price: high to low":
                    query = query.OrderByDescending(b => b.Price);
                    break;
                case "newest":
                    query = query.OrderByDescending(b => b.Published);
                    break;
                case "popularity":
                default:
                    query = query.OrderByDescending(b => b.Rating)
                                .ThenByDescending(b => b.ListedAt);
                    break;
            }

            // Calculate total count and pages
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)PageSize);

            // Apply pagination
            var books = await query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();

            // Create response object with pagination metadata
            var response = new
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = PageSize,
                Books = books
            };

            return Ok(response);
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
            // Validate discount dates if on sale
            if (addBookDto.OnSale)
            {
                if (addBookDto.DiscountEndDate < DateTime.UtcNow)
                {
                    return BadRequest("Discount end date must be in the future");
                }

                if (addBookDto.DiscountStartDate > addBookDto.DiscountEndDate)
                {
                    return BadRequest("Discount start date must be before end date");
                }
            }

            var bookEntity = new Book()
            {
                Title = addBookDto.Title,
                Description = addBookDto.Description,
                Price = addBookDto.Price,
                Isbn = addBookDto.Isbn,
                Stock = addBookDto.Stock,
                OnSale = addBookDto.OnSale,
                Published = addBookDto.Published,
                ListedAt = DateTime.UtcNow,
                DiscountedPercentage = addBookDto.OnSale ? addBookDto.DiscountedPercentage : 0,
                DiscountStartDate = addBookDto.OnSale ? addBookDto.DiscountStartDate : DateTime.MinValue,
                DiscountEndDate = addBookDto.OnSale ? addBookDto.DiscountEndDate : DateTime.MinValue,
                Language = addBookDto.Language,
                GenreName = addBookDto.GenreName,
                PublisherName = addBookDto.PublisherName,
                FormatName = addBookDto.FormatName,
                AuthorName = addBookDto.AuthorName
            };

            dbContext.Books.Add(bookEntity);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetBookById), new { id = bookEntity.Id }, bookEntity);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult UpdateBooks(int id, UpdateBookDto updateBookDto)
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }

            // Check if discount period has ended
            if (book.OnSale && book.DiscountEndDate < DateTime.UtcNow)
            {
                book.OnSale = false;
                book.DiscountedPercentage = 0;
                book.DiscountStartDate = DateTime.MinValue;
                book.DiscountEndDate = DateTime.MinValue;
            }
            else
            {
                // Validate new discount dates if setting on sale
                if (updateBookDto.OnSale)
                {
                    if (updateBookDto.DiscountEndDate < DateTime.UtcNow)
                    {
                        return BadRequest("Discount end date must be in the future");
                    }

                    if (updateBookDto.DiscountStartDate > updateBookDto.DiscountEndDate)
                    {
                        return BadRequest("Discount start date must be before end date");
                    }
                }

                book.Title = updateBookDto.Title;
                book.Description = updateBookDto.Description;
                book.Price = updateBookDto.Price;
                book.Isbn = updateBookDto.Isbn;
                book.Stock = updateBookDto.Stock;
                book.OnSale = updateBookDto.OnSale;
                book.Published = updateBookDto.Published;
                book.DiscountedPercentage = updateBookDto.OnSale ? updateBookDto.DiscountedPercentage : 0;
                book.DiscountStartDate = updateBookDto.OnSale ? updateBookDto.DiscountStartDate : DateTime.MinValue;
                book.DiscountEndDate = updateBookDto.OnSale ? updateBookDto.DiscountEndDate : DateTime.MinValue;
                book.Language = updateBookDto.Language;
                book.GenreName = updateBookDto.GenreName;
                book.AuthorName = updateBookDto.AuthorName;
                book.PublisherName = updateBookDto.PublisherName;
                book.FormatName = updateBookDto.FormatName;
            }

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
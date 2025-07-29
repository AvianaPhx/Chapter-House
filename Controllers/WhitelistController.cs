using Chapter_House.DTO.Whitelist;
using Chapter_House.Entities.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WhitelistController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public WhitelistController(UserManager<User> userManager, ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        // GET: api/whitelist
        [HttpGet]
        public async Task<IActionResult> GetMyWhitelist()
        {
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var myWhitelist = await _dbContext.Whitelists
                .Where(w => w.UserId == currentUser.Id)
                .Include(w => w.Book)
                .Select(w => new WhitelistItemDto
                {
                    Id = w.Book.Id,
                    Title = w.Book.Title,
                    Price = w.Book.Price,
                    Description = w.Book.Description,
                    Isbn = w.Book.Isbn,
                    AuthorName = w.Book.AuthorName,
                    Stock = w.Book.Stock,
                    OnSale = w.Book.OnSale,
                    DiscountedPercentage = w.Book.DiscountedPercentage ?? 0,
                    DiscountEndDate = w.Book.DiscountEndDate,
                    Image = null, 
                    Rating = w.Book.Rating,
                    GenreName = w.Book.GenreName,
                    FormatName = w.Book.FormatName,
                    PublisherName = w.Book.PublisherName,
                    Language = w.Book.Language
                })
                .ToListAsync();

            return Ok(myWhitelist);
        }

        [HttpPost]
        public async Task<IActionResult> AddToWhitelist([FromBody] AddToWhitelistDto addToWhitelistDto)
        {
            if (addToWhitelistDto == null || addToWhitelistDto.BookId <= 0)
            {
                return BadRequest("Invalid book ID.");
            }

            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var book = await _dbContext.Books
                .FirstOrDefaultAsync(b => b.Id == addToWhitelistDto.BookId);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            var existingWhitelist = await _dbContext.Whitelists
                .FirstOrDefaultAsync(w => w.UserId == currentUser.Id && w.BookId == addToWhitelistDto.BookId);

            if (existingWhitelist != null)
            {
                return Conflict("Book is already in your whitelist.");
            }

            var whitelistEntry = new Whitelist
            {
                UserId = currentUser.Id,
                BookId = addToWhitelistDto.BookId
            };

            try
            {
                _dbContext.Whitelists.Add(whitelistEntry);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMyWhitelist), new { bookId = whitelistEntry.BookId },
                    new { message = "Book added to your whitelist." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while adding the book to your whitelist.");
            }
        }

        [HttpDelete("{bookId:int}")]
        public async Task<IActionResult> RemoveFromWhitelist(int bookId)
        {
            if (bookId <= 0)
            {
                return BadRequest("Invalid book ID.");
            }

            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var whitelistEntry = await _dbContext.Whitelists
                .FirstOrDefaultAsync(w => w.UserId == currentUser.Id && w.BookId == bookId);

            if (whitelistEntry == null)
            {
                return NotFound("Book not found in your whitelist.");
            }

            try
            {
                _dbContext.Whitelists.Remove(whitelistEntry);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Book removed from your whitelist." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while removing the book from your whitelist.");
            }
        }
    }
}
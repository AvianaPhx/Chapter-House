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
            // Get the currently authenticated user
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Get all books in the user's whitelist
            var myWhitelist = await _dbContext.Whitelists
                .Where(w => w.UserId == currentUser.Id)  // Use the user's int Id
                .Include(w => w.Book)  // Include related book data
                .Select(w => new WhitelistItemDto
                {
                    Id = w.Book.Id,
                    Title = w.Book.Title,
                    Price = w.Book.Price,
                    Description = w.Book.Description,
                    Isbn = w.Book.Isbn
                })
                .ToListAsync();

            return Ok(myWhitelist);
        }

        // POST: api/whitelist
        [HttpPost]
        public async Task<IActionResult> AddToWhitelist([FromBody] AddToWhitelistDto addToWhitelistDto)
        {
            // Validate input
            if (addToWhitelistDto == null || addToWhitelistDto.BookId <= 0)
            {
                return BadRequest("Invalid book ID.");
            }

            // Get the currently authenticated user
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Find the book by BookId
            var book = await _dbContext.Books
                .FirstOrDefaultAsync(b => b.Id == addToWhitelistDto.BookId);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            // Check if the book is already in the user's whitelist
            var existingWhitelist = await _dbContext.Whitelists
                .FirstOrDefaultAsync(w => w.UserId == currentUser.Id && w.BookId == addToWhitelistDto.BookId);

            if (existingWhitelist != null)
            {
                return Conflict("Book is already in your whitelist.");
            }

            // Add the book to the whitelist
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

        // DELETE: api/whitelist/{bookId}
        [HttpDelete("{bookId:int}")]
        public async Task<IActionResult> RemoveFromWhitelist(int bookId)
        {
            // Validate input
            if (bookId <= 0)
            {
                return BadRequest("Invalid book ID.");
            }

            // Get the currently authenticated user
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Find the whitelist entry for the user and book
            var whitelistEntry = await _dbContext.Whitelists
                .FirstOrDefaultAsync(w => w.UserId == currentUser.Id && w.BookId == bookId);

            if (whitelistEntry == null)
            {
                return NotFound("Book not found in your whitelist.");
            }

            try
            {
                // Remove the book from the whitelist
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
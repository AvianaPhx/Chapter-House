using Chapter_House.DTO.Review;
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
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<User> _userManager;

        public ReviewController(ApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        // GET: api/review/{bookId}
        [HttpGet("{bookId:int}")]
        public async Task<IActionResult> GetReviews(int bookId)
        {
            var reviews = await _dbContext.Set<ReviewsDTO>()
                .Where(r => r.BookId == bookId)
                .OrderByDescending(r => r.Date)
                .ToListAsync();
            return Ok(reviews);
        }

        // POST: api/review
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostReview([FromBody] ReviewsDTO reviewDto)
        {
            if (reviewDto == null || reviewDto.BookId <= 0 || reviewDto.Rating < 1 || reviewDto.Rating > 5)
                return BadRequest("Invalid review data.");

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            // Check if user has purchased the book
            var hasPurchased = await _dbContext.Orders
                .Include(o => o.OrderItems)
                .AnyAsync(o => o.UserId == user.Id && o.OrderItems.Any(oi => oi.BookId == reviewDto.BookId) && o.Status != "Cancelled");

            if (!hasPurchased)
                return Forbid("You can only review books you have purchased.");

            // Prevent duplicate review by same user for same book
            var alreadyReviewed = await _dbContext.Set<ReviewsDTO>()
                .AnyAsync(r => r.BookId == reviewDto.BookId && r.UserId == user.Id);
            if (alreadyReviewed)
                return Conflict("You have already reviewed this book.");

            var review = new ReviewsDTO
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                Date = DateTime.UtcNow,
                BookId = reviewDto.BookId,
                UserId = user.Id,
                UserName = user.UserName
            };

            _dbContext.Add(review);
            await _dbContext.SaveChangesAsync();

            return Ok(review);
        }
    }
}

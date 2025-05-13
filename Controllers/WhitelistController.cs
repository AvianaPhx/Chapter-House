using Microsoft.AspNetCore.Mvc;
using System;
using Chapter_House.Entities; 
using Chapter_House.Controllers; 
using Chapter_House.DTO; 


namespace Chapter_House.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WhitelistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WhitelistController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddToWhitelist([FromBody] AddToWhitelistRequest request)
        {
            if (request == null || request.BookId <= 0 || request.MemberId <= 0)
            {
                return BadRequest("Invalid request.");
            }

            var entry = new Whitelist
            {
                MemberId = request.MemberId,
                BookId = request.BookId,
                DateAdded = DateTime.Now
            };

            _context.Whitelists.Add(entry);
            _context.SaveChanges();

            return Ok("Book added to whitelist.");
        }
    }
}

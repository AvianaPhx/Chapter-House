using Microsoft.AspNetCore.Mvc;
using System;
using Chapter_House.Controllers;          
using Chapter_House.Entities;        
using Chapter_House.DTO;           

namespace Chapter_House.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddToCart([FromBody] AddToCartRequest request)
        {
            if (request == null || request.BookId <= 0 || request.MemberId <= 0 || request.Quantity <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            var cartItem = new Cart
            {
                MemberId = request.MemberId,
                BookId = request.BookId,
                Quantity = request.Quantity,
                AddedDate = DateTime.Now
            };

            _context.Carts.Add(cartItem);
            _context.SaveChanges();

            return Ok("Book added to cart.");
        }
    }
}

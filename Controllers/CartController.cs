using Chapter_House.DTO.Cart;
using Chapter_House.Entities.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Chapter_House.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public CartController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]

        public async Task<IActionResult> GetCart()
        {
            // Retrieve the user ID from the authenticated user
            var userIdClaim = User.FindFirst("id"); // Look for the "id" claim in the token

            if (userIdClaim == null)
            {
                return Unauthorized("User is not authenticated.");  // Return Unauthorized if the claim is not found
            }

            // Parse the user ID from the claim
            var userId = int.Parse(userIdClaim.Value);

            // Fetch the user's cart from the database
            var cart = await dbContext.Carts
                                      .Where(c => c.UserId == userId)  // Use the user ID from the claim
                                      .Include(c => c.CartItems)
                                          .ThenInclude(ci => ci.Book)
                                      .FirstOrDefaultAsync();

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            // Return the cart items
            return Ok(cart.CartItems.Select(ci => new
            {
                CartItemId = ci.Id,
                ci.Book.Title,
                ci.Book.Price,
                ci.Quantity
            }));
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto addToCartDto)
        {
            var userIdClaim = User.FindFirst("id");

            if (userIdClaim == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var userId = int.Parse(userIdClaim.Value);

            var book = await dbContext.Books.FindAsync(addToCartDto.BookId);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            var cart = await dbContext.Carts
                                      .Where(c => c.UserId == userId)
                                      .FirstOrDefaultAsync();

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                dbContext.Carts.Add(cart);
                await dbContext.SaveChangesAsync();
            }

            var existingItem = await dbContext.CartItems
                                              .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.BookId == addToCartDto.BookId);

            if (existingItem != null)
            {
                existingItem.Quantity += addToCartDto.Quantity;
                dbContext.CartItems.Update(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    BookId = addToCartDto.BookId,
                    Quantity = addToCartDto.Quantity
                };
                dbContext.CartItems.Add(cartItem);
            }

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Book added to cart." });
        }

        [HttpPut("{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDto updateCartItemDto)
        {
            var cartItem = await dbContext.CartItems.FindAsync(cartItemId);

            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            cartItem.Quantity = updateCartItemDto.Quantity;

            dbContext.CartItems.Update(cartItem);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Cart item updated." });
        }

        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            var cartItem = await dbContext.CartItems.FindAsync(cartItemId);

            if (cartItem == null)
            {
                return NotFound("Cart item not found.");
            }

            dbContext.CartItems.Remove(cartItem);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Book removed from cart." });
        }


    }
}

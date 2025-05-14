using Chapter_House.DTO.Books;
using Chapter_House.DTO.Order;
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
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public OrderController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] List<OrderItemDto> items)
        {
            if (items == null || !items.Any())
                return BadRequest("No items provided.");

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending", 
                OrderItems = new List<OrderItem>()
            };

            decimal total = 0;

            foreach (var item in items)
            {
                var book = await _context.Books.FindAsync(item.BookId);
                if (book == null) return NotFound($"Book ID {item.BookId} not found");

                var orderItem = new OrderItem
                {
                    BookId = book.Id,
                    Quantity = item.Quantity,
                    UnitPrice = book.Price
                };

                total += item.Quantity * book.Price;
                order.OrderItems.Add(orderItem);
            }

            order.TotalAmount = total;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { order.Id, order.TotalAmount });
        }

        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
                return NotFound("Order not found.");

            if (order.Status == "Cancelled")
                return BadRequest("Order is already cancelled.");

            if (order.Status != "Pending")
                return BadRequest("Only pending orders can be cancelled.");

            order.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok("Order cancelled successfully.");
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.User) 
                .ToListAsync();

            var orderDtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                User = o.User != null ? new UserDto
                {
                    Id = o.User.Id,
                    Email = o.User.Email,
                    Name = o.User.UserName
                } : null,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    BookId = oi.BookId,
                    Quantity = oi.Quantity,
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Staff,Admin")]  
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.User)
                .ToListAsync();

            var orderDtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                User = o.User != null ? new UserDto
                {
                    Id = o.User.Id,
                    Email = o.User.Email,
                    Name = o.User.UserName
                } : null,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    BookId = oi.BookId,
                    Quantity = oi.Quantity,
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        [HttpPost("claim")]
        public async Task<IActionResult> ProcessClaimCode([FromBody] string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return BadRequest("Invalid code.");

            return Ok($"Code '{code}' processed successfully (stub response).");
        }

        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveOrder(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
                return NotFound("Order not found.");

            if (order.Status == "Approved")
                return BadRequest("Order is already approved.");

            if (order.Status != "Pending")
                return BadRequest("Only pending orders can be approved.");

            order.Status = "Approved";
            await _context.SaveChangesAsync();

            return Ok("Order approved successfully.");
        }
    }
}

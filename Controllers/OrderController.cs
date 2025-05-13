using Microsoft.AspNetCore.Mvc;
using Chapter_House.Controllers;
using Chapter_House.Entities;
using System;
using System.Linq;


namespace Chapter_House.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("place")]
        public IActionResult PlaceOrder(PlaceOrderRequest request)
        {
            var order = new Order
            {
                MemberId = request.MemberId,
                OrderDate = DateTime.Now,
                IsCancelled = false
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok("Order placed successfully.");
        }

        [HttpPost("cancel/{orderId}")]
        public IActionResult CancelOrder(int orderId)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
                return NotFound("Order not found");

            order.IsCancelled = true;
            _context.SaveChanges();

            return Ok("Order cancelled.");
        }
    }
}

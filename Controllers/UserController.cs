using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public UserController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public IActionResult GetAllUser()
        {
            var allUser = dbContext.Users.ToList();

            return Ok(allUser);
        }

    }
}

using Chapter_House.DTO.AdminUser;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminUserController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public AdminUserController(ApplicationDbContext db) => dbContext = db;

        [HttpGet]
        public IActionResult GetAllUser()
        {
            var allUser = dbContext.Users.ToList();

            return Ok(allUser);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetUserById(int id)
        {
            var user = dbContext.Users.Find(id);

            if ( user is null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult UpdateUser(int id, AdminUpdateUserDto adminUpdateUserDto)
        {
            var user = dbContext.Users.Find(id);

            if (user is null)
            {
                return NotFound();
            }

            user.MembershipStatus = adminUpdateUserDto.MembershipStatus;

            dbContext.SaveChanges();

            return Ok(user);
        }

    }
}

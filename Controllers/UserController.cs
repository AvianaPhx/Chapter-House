using Chapter_House.DTO.User;
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
        public IActionResult UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = dbContext.Users.Find(id);

            if(user is null)
            {
                return NotFound();
            }

            user.UserName = updateUserDto.UserName;
            user.Address = updateUserDto.Address;

            dbContext.SaveChanges();

            return Ok(user);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeleteUser(int id)
        {
            var user = dbContext.Users.Find(id);

            if (user is null)
            {
                return NotFound();
            }

            dbContext.Users.Remove(user);
            dbContext.SaveChanges();

            return Ok(user);
        }
    }
}

using Chapter_House.DTO;
using Chapter_House.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly IAuthService _auth;
        public AuthController(IAuthService authService) => _auth = authService;
        

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _auth.SignUpAsync(request);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _auth.SignInAsync(request);
            return result.IsSuccess ? Ok(result) : Unauthorized(result);
        }
    }
}

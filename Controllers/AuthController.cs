using Chapter_House.DTO.SignIn;
using Chapter_House.DTO.SignUp;
using Chapter_House.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly IAuthService _auth;
        public AuthController(IAuthService authService) => _auth = authService;

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string absoluteUrl = Request.GetDisplayUrl();
            var result = await _auth.SignUpAsync(request);
            return result.IsSuccess ? Ok(result) : BadRequest(result);
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            string absoluteUrl = Request.GetDisplayUrl();
            var result = await _auth.SignInAsync(request);
            return result.IsSuccess ? Ok(result) : Unauthorized(result);
        }
    }
}

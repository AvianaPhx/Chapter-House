using Chapter_House.Entities;
using Chapter_House.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> SignUp(SignUpRequest request)
        {
            SignUpResponse response = new();

            try
            {

            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;

            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SignIn(SignInRequest request)
        {
            SignInResponse response = new();

            try
            {

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;

            }

            return Ok(response);
        }
    }
}

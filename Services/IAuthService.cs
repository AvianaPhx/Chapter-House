using Chapter_House.DTO.SignIn;
using Chapter_House.DTO.SignUp;

namespace Chapter_House.Services
{
    public interface IAuthService
    {
        Task<SignUpResponse> SignUpAsync(SignUpRequest req);
        Task<SignInResponse> SignInAsync(SignInRequest req);
    }
}

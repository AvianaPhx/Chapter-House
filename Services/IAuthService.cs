using Chapter_House.DTO;

namespace Chapter_House.Services
{
    public interface IAuthService
    {
        Task<SignUpResponse> SignUpAsync(SignUpRequest req);
        Task<SignInResponse> SignInAsync(SignInRequest req);
    }
}

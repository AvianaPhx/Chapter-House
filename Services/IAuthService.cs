using Chapter_House.Entities;

namespace Chapter_House.Services
{
    public interface IAuthService
    {
        public Task<SignUpResponse> SignUp(SignUpRequest request);
        public Task<SignInResponse> SignIn(SignInRequest request);
    }
}

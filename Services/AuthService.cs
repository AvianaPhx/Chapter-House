using Chapter_House.Entities;

namespace Chapter_House.Services
{
    public class AuthService : IAuthService
    {
        public Task<SignInResponse> SignIn(SignInRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<SignUpResponse> SignUp(SignUpRequest request)
        {
            throw new NotImplementedException();
        }
    }
}

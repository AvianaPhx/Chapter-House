using Chapter_House.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Runtime.CompilerServices;
using System.IdentityModel.Tokens.Jwt;
using Chapter_House.Entities.Core;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Chapter_House.DTO.SignIn;
using Chapter_House.DTO.SignUp;

namespace Chapter_House.Services
{
    public class AuthService : IAuthService
    {

        private readonly ApplicationDbContext _db;
        private readonly JwtSettings _jwt;

        public AuthService(ApplicationDbContext db, IOptions<JwtSettings> jwtOptions)
        {
            _db = db;
            _jwt = jwtOptions.Value;
        }


        public async Task<SignUpResponse> SignUpAsync(SignUpRequest req)
        {
            // Checking the Email already used or not
            if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            {
                return new SignUpResponse
                {
                    IsSuccess = false,
                    Message = "Email already Registered"
                };
            }

            // Hashing the password
            string hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                UserName = req.UserName,
                Email = req.Email,
                PasswordHash = hash
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new SignUpResponse
            {
                IsSuccess = true,
                Message = "User created",
                UserId = user.Id
            };
        }

        public async Task<SignInResponse> SignInAsync(SignInRequest req)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email && u.Role == req.Role);
            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return new SignInResponse
                {
                    IsSuccess = false,
                    Message = "Invalid email or password"
                };
            }

            var (token, expires) = GenerateJwtToken(user);

            return new SignInResponse
            {
                IsSuccess = true,
                Message = "Login successful",
                AccessToken = token,
                ExpiresAt = expires
            };
        }

        private (string token, DateTime expires) GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub,  user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email,user.Email),
            new Claim(ClaimTypes.Role,              user.Role.ToString())
        };

            var expires = DateTime.UtcNow.AddHours(_jwt.ExpiryHours);

            var token = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }

    }
}

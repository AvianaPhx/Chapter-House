using Chapter_House.DTO;
using Chapter_House.Entities;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Runtime.CompilerServices;
using Chapter_House.Entities.Core;

namespace Chapter_House.Services
{
    public class AuthService : IAuthService
    {

        private readonly ApplicationDbContext _db;
        public AuthService(ApplicationDbContext db) => _db = db;


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

            return new SignInResponse
            {
                IsSuccess = true,
                Message = "Login successful"
            };
        }

    }
}

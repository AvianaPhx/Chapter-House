namespace Chapter_House.DTO.SignIn
{
    public class SignInResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? AccessToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? Role { get; set; }
    }
}
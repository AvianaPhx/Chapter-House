namespace Chapter_House.DTO
{
    public class SignInResponse
    {
        public bool IsSuccess { get; init; }
        public string Message { get; init; } = string.Empty;


        public string? AccessToken { get; init; }
        public DateTime? ExpiresAt { get; init; }
        public int Role { get; init; }
    }
}

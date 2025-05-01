namespace Chapter_House.DTO
{
    public class SignUpResponse
    {
        public bool IsSuccess { get; init; }

        public string Message { get; init; } = string.Empty;

        public int? UserId { get; init; }
    }
}

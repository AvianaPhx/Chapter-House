namespace Chapter_House.DTO.SignUp
{
    public class SignUpResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? UserId { get; set; }
    }
}
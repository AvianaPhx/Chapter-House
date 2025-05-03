namespace Chapter_House.Entities
{
    public record JwtSettings
    {
        public string Issuer { get; init; } = string.Empty;
        public string Audience { get; init; } = string.Empty;
        public string Secret { get; init; } = string.Empty;
        public int ExpiryHours { get; init; } = 12;
    }
}

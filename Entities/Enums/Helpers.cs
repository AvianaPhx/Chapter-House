namespace Chapter_House.Entities.Enums
{
    public enum DiscountKind
    {
        Percentage, FixedAmount
    }

    public enum Format
    {
        Paperback,
        Hardcover,
        Signed,
        Limited,
        FirstEdition,
        Collectors,
        AuthorsEdition,
        Deluxe
    }

    public enum OrderStatus
    {
        Pending, Paid, Cancelled, Processing, Completed
    }
}

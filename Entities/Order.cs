public class Order
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public DateTime OrderDate { get; set; }
    public bool IsCancelled { get; set; } = false;
}

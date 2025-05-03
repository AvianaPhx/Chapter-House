namespace Chapter_House.Entities.Enums
{
    public class Helpers
    {
        public enum Role { User = 0, Staff = 1, Admin = 2 }

        public enum OrderStatus { Pending, Paid, Cancelled, Processing, Completed }

        public enum DiscountKind { Percentage, FixedAmount }
    }
}

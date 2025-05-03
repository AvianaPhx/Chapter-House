using Chapter_House.Entities.Core;
using Chapter_House.Entities.Lookup;

namespace Chapter_House.Entities.Bridge
{
    public class BookAward
    {
        public int BookId { get; set; }

        public int AwardId { get; set; }

        public Book Book { get; set; } = null!;

        public Award Award { get; set; } = null!;
    }
}

using Chapter_House.Entities.Core;
using Chapter_House.Entities.Lookup;

namespace Chapter_House.Entities.Bridge
{
    public class BookGenre
    {
        public int BookId { get; set; }
        public int GenreId { get; set; }

        public Book Book { get; set; } = null!;
        public Genre Genre { get; set; } = null!;

    }
}

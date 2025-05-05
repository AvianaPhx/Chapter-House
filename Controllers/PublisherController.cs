using Chapter_House.Entities.Lookup;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    public class PublisherController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public PublisherController(ApplicationDbContext db)
        {
            dbContext = db;
        }

        [HttpGet]
        public IActionResult GetAllPublishers()
        {
            var allPublisher = dbContext.BookPublishers.ToList();

            return Ok(allPublisher);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetPublisherById(int id)
        {
            var publisher = dbContext.BookPublishers.Find(id);

            if (publisher is null)
            {
                return NotFound();
            }

            return Ok(publisher);
        }

    }
}

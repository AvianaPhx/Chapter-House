using Chapter_House.DTO.Publisher;
using Chapter_House.Entities.Lookup;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublisherController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public PublisherController(ApplicationDbContext db) => dbContext = db;

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

        [HttpPost]
        public IActionResult AddPublisher(AddPublisherDto addPublisherDto)
        {
            var publisherEntity = new BookPublisher()
            {
                PublisherName = addPublisherDto.PublisherName
            };

            dbContext.BookPublishers.Add(publisherEntity);
            dbContext.SaveChanges();

            return Ok(publisherEntity);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult UpdatePublisher(int id, UpdatePublisherDto updatePublisherDto)
        {
            var publisher = dbContext.BookPublishers.Find(id);

            if (publisher is null)
            {
                return NotFound();
            }

            publisher.PublisherName = updatePublisherDto.PublisherName;

            dbContext.SaveChanges();

            return Ok(publisher);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeletePublisher(int id)
        {
            var publisher = dbContext.BookPublishers.Find(id);

            if (publisher is null)
            {
                return NotFound();
            }

            dbContext.BookPublishers.Remove(publisher);
            dbContext.SaveChanges();

            return Ok(publisher);
        }

    }
}

using Chapter_House.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chapter_House.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailSender _emailSender;

        public EmailController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        [HttpPost("send-test")]
        public async Task<IActionResult> SendTestEmail()
        {
            var receiver = "shaswats.snm@gmail.com";
            var subject = "Test Email from Chapter House";
            var message = "Hello AOri, this is a test email from your backend.";

            try
            {
                await _emailSender.SendEmailAsync(receiver, subject, message);
                return Ok("Email sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to send email: {ex.Message}");
            }
        }
    }
}
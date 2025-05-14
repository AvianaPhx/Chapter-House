using System.Net;
using System.Net.Mail;

namespace Chapter_House.Services
{
    public class EmailSender : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var senderEmail = "avianaphoenixspam@gmail.com";
            var senderPassword = "@ silent voice 1"; 

            var client = new SmtpClient("smtp-mail.outlook.com", 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(senderEmail, senderPassword)
            };

            var mailMessage = new MailMessage(from: senderEmail, to: email, subject, message);
            await client.SendMailAsync(mailMessage);
        }
    }
}

namespace Chapter_House
{
    public static class SocketMessage

    {

        public static async Task Message(this HttpContext context)

        {

            await context.Response.WriteAsync("test message from static class");

        }

    }
}

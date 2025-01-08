using DotNetEnv;
using app.Database;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Builder;

using Npgsql;
namespace app;

class Program
{
    static async Task Main()
    {   
        var builder = WebApplication.CreateBuilder();

        var app = builder.Build();
        
        // Serve static files from wwwroot
        app.UseDefaultFiles(); // Serving index.html as the default file
        app.UseStaticFiles(); // Serves other static files like CSS, JS, images, etc.
        
        
        app.Use(async (context, next) =>
        {
            const string clientIdCookieName = "ClientId";

            if (!context.Request.Cookies.TryGetValue(clientIdCookieName, out var clientId))
            {
                // Generate a new unique client ID
                clientId = GenerateUniqueClientId();
                context.Response.Cookies.Append(clientIdCookieName, clientId, new CookieOptions
                {
                    HttpOnly = true, // Prevent client-side JavaScript from accessing the cookie
                    Secure = false,   // Use only over HTTPS (false for dev)
                    SameSite = SameSiteMode.Strict,
                    MaxAge = TimeSpan.FromDays(365) // Cookie expiration
                });
                Console.WriteLine($"New client ID generated and set: {clientId}");
            }
            else
            {
                Console.WriteLine($"Existing client ID found: {clientId}");
            }

            // Pass to the next middleware
            await next();
        });

        // Helper function to generate a unique client ID
        static string GenerateUniqueClientId()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[16];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        // methods for proccessing posts and gets
        
        app.MapPost("/start-session", async (HttpContext context) => 
        {
            
        });
        
        app.MapPost("/connect-session-code", async (HttpContext context) => 
        {
            
        });
                                                   
                                                       
                                                   
        
        /*
        app.MapPost("/set-name", async (HttpContext context) =>
                {
                    // Player here, is a class that defines the post requestBody format
                    var requestBody = await context.Request.ReadFromJsonAsync<Player>();
                    if (requestBody?.name is null)
                    {
                        return Results.BadRequest("name is required.");
                    }
                    Player player = await EditPlayer(requestBody.name, context.Request.Cookies["ClientId"]);
                    return (player.Id > 0) ? Results.Ok(player) : Results.StatusCode(500);
                }); */
        
        
        
        
        Env.TraversePath().Load();//laddar in variabler från .env filen behöver en variabel exempel nedaför när vi har skapat vår db
        // DBConnectString="Host=localhost;Port=5432;Username=postgres;Password=pass123;Database=dbname;SearchPath=public"
        
        DatabaseConnection database = new();
        
        
        
        
        
        app.Run(); //startar servern 
        
        Console.WriteLine("Program will now exit, press any key to continue");
        Console.ReadKey();
    }
}
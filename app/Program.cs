using DotNetEnv;
using app.Database;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Builder;

namespace app;

class Program
{
    static async Task Main()
    {   
        Env.TraversePath().Load();//laddar in variabler från .env filen behöver en variabel exempel nedaför när vi har skapat vår db
        // DBConnectString="Host=localhost;Port=5432;Username=postgres;Password=pass123;Database=dbname;SearchPath=public"        
        DatabaseConnection database = new();
        Actions actions = new(database.Connection());
        
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
                context.Items[clientIdCookieName] = clientId;
                await actions.AddIdToDb(clientId);
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
            return Convert.ToBase64String(bytes).TrimEnd('=');
        }

        // methods for proccessing posts and gets

        /*
         * todo
         * behöver kunna hantera ifall en spelare är connected eller ej, ifall en spelare försöker öppna ny lobby medans i en lobby
         * att en spelare disconnectar från en lobby
         * ta bort ett game om alla disconnectar i lobby state, byta state till ended ifall alla lämnar medans state är active.
         * tracka winner i db
         */
        app.MapPost("/join-session", async (HttpContext context) =>  // hanterar join och create session
        {
            var requestBody = await context.Request.ReadFromJsonAsync<JoinSession>();
            if(requestBody?.connectType is null)
            {
                return Results.BadRequest("not a valid request.");
            } 
            
            Console.WriteLine($"ConnectType: {requestBody.connectType}");
            Console.WriteLine($"Game Code: {requestBody.GameCode}");
            Console.WriteLine($"Round Time:: {requestBody.Settings.roundTimeInput} secods.");
            Console.WriteLine($"Number of Rounds: {requestBody.Settings.numberOfRoundsInput}");
            Console.WriteLine($"Extra Points: {requestBody.Settings.extraPointsCheckbox}");
            
            Game game;
            bool success;
            
            
            if (requestBody.connectType == "StartSession")
            {
                (success, game) = await actions.NewSession(context.Request.Cookies["ClientId"]);
            } 
            else if (requestBody.connectType == "ConnectSessionViaCode")
            {
                (success, game) = await actions.JoinSessionViaCode(context.Request.Cookies["ClientId"], requestBody.GameCode);
            }
            else
            {
                return Results.BadRequest("not a valid connectType");
            }
            return success ? Results.Ok(game) : Results.StatusCode(500);
        });
        
        app.MapPost("/changeName", async (HttpContext context) =>
        {
            // Player here, is a class that defines the post requestBody format
            var requestBody = await context.Request.ReadFromJsonAsync<Users>();
            if (requestBody?.name is null)
            {
                return Results.BadRequest("name is required.");
            }
            
            Users user = await actions.AddPlayer(context.Request.Cookies["ClientId"] ?? context.Items["ClientId"]?.ToString(), requestBody.name);
            return Results.Ok(user); // needs Results.StatusCode(500) if query for db fails
        });
        
        // Task: Get game status
        app.MapGet("/game-status", async (HttpContext context) => 
        {
            var gameIdStr = context.Request.Query["gameId"];
            if (int.TryParse(gameIdStr, out int gameId))
            {
                var state = await actions.GetGameStatus(gameId);
                return state != null ? Results.Ok(new { state }) : Results.StatusCode(500);
            }
            else
            {
                return Results.BadRequest("Ogiltigt spel-ID.");
            }
        });

        // Task: Disconnect game
        app.MapPost("/disconnect", async (HttpContext context) => 
        {
            var gameIdStr = context.Request.Query["gameId"];
            var playerId = context.Request.Cookies["ClientId"];
            if (int.TryParse(gameIdStr, out int gameId))
            {
                var success = await actions.Disconnect(gameId, playerId);
                return success ? Results.Ok("Du har kopplats från spelet.") : Results.StatusCode(500);
            }
            else
            {
                return Results.BadRequest("Ogiltigt spel-ID.");
            }
        });

        // Task: Forfeit a round
        app.MapPost("/forfeit-round", async (HttpContext context) => 
        {
            var gameIdStr = context.Request.Query["gameId"];
            var playerId = context.Request.Cookies["ClientId"];
            if (int.TryParse(gameIdStr, out int gameId))
            {
                var success = await actions.ForfeitRound(gameId, playerId);
                return success ? Results.Ok("Rundan förlorades framgångsrikt.") : Results.StatusCode(500);
            }
            else
            {
                return Results.BadRequest("Ogiltigt spel-ID.");
            }
        });

        // Task: End turn early
        app.MapPost("/end-turn", async (HttpContext context) => 
        {
            var gameIdStr = context.Request.Query["gameId"];
            var playerId = context.Request.Cookies["ClientId"];
            if (int.TryParse(gameIdStr, out int gameId))
            {
                var success = await actions.EndTurn(gameId, playerId);
                return success ? Results.Ok("Turen har avslutats.") : Results.StatusCode(500);
            }
            else
            {
                return Results.BadRequest("Ogiltigt spel-ID.");
            }
        });

        
        
        {

            app.MapGet("/new-word", async (HttpContext context) =>
            {
                Int32 wordLength = Int32.Parse(context.Request.Query["length"]);

                string word = await actions.GetWord(wordLength);

                return word;
                //return String.IsNullOrEmpty(word) ? Results.BadRequest("cannot find a word") : word; silly me
                //bool success = await actions.GetWord(word: requestBody.Word);

                //return success ? Results.Ok("Word added successfully.") : Results.StatusCode(500);

            });

        }
        
        
        
        app.Run(); //startar servern 
        
        Console.WriteLine("Program will now exit, press any key to continue");
    }
}

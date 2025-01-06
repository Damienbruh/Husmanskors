using DotNetEnv;
using app.Database;
namespace app;

class Program
{
    static async Task Main()
    {
        Env.TraversePath().Load();  //laddar in variabler från .env filen behöver en variabel exempel nedaför när vi har skapat vår db
        // DBConnectString="Host=localhost;Port=5432;Username=postgres;Password=pass123;Database=dbname;SearchPath=public"

        DatabaseConnection database = new();
        

        Console.WriteLine("Program will now exit, press any key to continue");
        Console.ReadKey();
    }
}
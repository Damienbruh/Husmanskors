using Microsoft.AspNetCore.Builder;
using Npgsql;
using app.Database;
namespace app;

public class actions
{
    DatabaseConnection database = new();
    private NpgsqlDataSource db;

    public actions(WebApplication app)
    {
        async Task<Users> AddPlayer(string name, string clientId)
        {
            // check if player already exists
            await using var cmd = db.CreateCommand("SELECT * FROM users WHERE name = $1"); // check if player exists
            cmd.Parameters.AddWithValue(name);
            await using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    var dbClientId = reader.GetString(1);
                    if (clientId.Equals(dbClientId) == false)
                    {
                        // save new user_id to db
                        await using var cmd2 = db.CreateCommand("UPDATE users SET user_id = $1 WHERE id = $2");
                        cmd2.Parameters.AddWithValue(clientId);
                        cmd2.Parameters.AddWithValue(reader.GetInt32(2));
                        await cmd2.ExecuteNonQueryAsync(); // Perform update
                    }
                    return new Users(reader.GetString(0), clientId, reader.GetInt32(2));
                }
            }
            // if player did not exist we create them
            await using var cmd3 = db.CreateCommand("INSERT INTO users (name, user_id) VALUES ($1, $2) RETURNING id");
            cmd3.Parameters.AddWithValue(name);
            cmd3.Parameters.AddWithValue(clientId);
            var result = await cmd3.ExecuteScalarAsync();
            if (result != null && int.TryParse(result.ToString(), out int lastInsertedId))
            {
                return new Users(name, clientId, lastInsertedId);
            }
            else
            {
                Console.WriteLine("Failed to retrieve the last inserted ID.");
                return null;
            }
        }
    }
}
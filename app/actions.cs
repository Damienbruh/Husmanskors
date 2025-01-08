using Microsoft.AspNetCore.Builder;
using Npgsql;
using app.Database;
namespace app;

public class Actions
{
    private NpgsqlDataSource _db;
    public Actions(NpgsqlDataSource db)
    {
        _db = db;
    }
    public async Task<(bool, Game? game)> NewSession(string clientId)
    {
        if (String.IsNullOrEmpty(clientId))
        {
            return (false, null);
        }
        
        Game game = null;
        int gameId;
        bool success = true; // todo ändra om query fails
        await using var cmd = _db.CreateCommand("INSERT INTO users (user_id)" +
                                                "VALUES ($1) ON CONFLICT (user_id) DO NOTHING"); // possible problems whit id collision
        cmd.Parameters.AddWithValue(clientId);
        await cmd.ExecuteNonQueryAsync();
        
        await using var cmd2 = _db.CreateCommand("INSERT INTO games (player_1, state, gamecode)" +
                                                 "VALUES ($1, 'lobby', 'gamecode1') RETURNING game_id"); //todo  need to add random gamecode with check for conflict
        cmd2.Parameters.AddWithValue(clientId);
        gameId = Convert.ToInt32(await cmd2.ExecuteScalarAsync());
        
        game = new Game(gameId, clientId, null, "lobby", "gamecode1");
        return (true, game);
    }
    public async Task<(bool, Game game)> JoinSessionViaCode(string clientId, string gameCode)
    {
        Game game = null;
        return game != null ? (true, game) : (false, null);
    }
    public async Task<Users> AddPlayer(string name, string clientId)
    {
        // check if player already exists
        await using var cmd = _db.CreateCommand("SELECT * FROM users WHERE name = $1"); // check if player exists
        cmd.Parameters.AddWithValue(name);
        await using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                var dbClientId = reader.GetString(1);
                if (clientId.Equals(dbClientId) == false)
                {
                    // save new clientId to db
                    await using var cmd2 = _db.CreateCommand("UPDATE users SET user_id = $1 WHERE id = $2");
                    cmd2.Parameters.AddWithValue(clientId);
                    cmd2.Parameters.AddWithValue(reader.GetInt32(2));
                    await cmd2.ExecuteNonQueryAsync(); // Perform update
                }
                return new Users(reader.GetString(0), clientId, reader.GetInt32(2));
            }
        }
        // if player did not exist we create them
        await using var cmd3 = _db.CreateCommand("INSERT INTO users (name, user_id) VALUES ($1, $2) RETURNING id");
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
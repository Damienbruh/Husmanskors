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
    public async Task<Users?> AddPlayer(string clientId, string name)
    {
        int rows = 0;
        if (!String.IsNullOrEmpty(name))
        {
            await using var cmd = _db.CreateCommand("INSERT INTO users (user_id, name)" +
                                                    "VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name"); // possible problems whit id collision
            cmd.Parameters.AddWithValue(clientId);
            cmd.Parameters.AddWithValue(name);
            rows = await cmd.ExecuteNonQueryAsync();
        }
        
        if (rows <= 0)
        {
            await using var cmd2 = _db.CreateCommand("SELECT user_id FROM users WHERE user_id = $1");
            cmd2.Parameters.AddWithValue(clientId);
            return new Users(clientId, cmd2.ExecuteScalarAsync().ToString());
        }

        return new Users(clientId, name);
    }
}
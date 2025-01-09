using Npgsql;
using System.Security.Cryptography;
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

        string gameCode;

        do
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[8];
            rng.GetBytes(bytes);
            gameCode = Convert.ToBase64String(bytes);
        } while (await checkUniqueGameCode(gameCode));

        async Task<bool> checkUniqueGameCode(string gCode)
        {
            await using var cmd = _db.CreateCommand("SELECT COUNT(*) FROM games WHERE gamecode = $1 AND state != 'ended'");
            cmd.Parameters.AddWithValue(gCode);
            var result = await cmd.ExecuteScalarAsync();
            return (long)result > 0; // todo handle null
        }
        
        
        //todo check if clientId is in another game with state lobby and if so remove them from it, if they are player1 remove entry in db
        
        
        await using var cmd2 = _db.CreateCommand("INSERT INTO games (player_1, state, gamecode)" +
                                                 "VALUES ($1, 'lobby', $2) RETURNING game_id"); //todo  need to add random gamecode with check for conflict
        cmd2.Parameters.AddWithValue(clientId);
        cmd2.Parameters.AddWithValue(gameCode);
        gameId = Convert.ToInt32(await cmd2.ExecuteScalarAsync());
        if (gameId == 0) return (false, game);
        
        game = new Game(gameId, clientId, null, "lobby", gameCode);
        return (true, game);
    }
    public async Task<(bool, Game game)> JoinSessionViaCode(string clientId, string gameCode)
    {
        
        //update games 
        
        return (false, null);
    }
    public async Task<Users?> AddPlayer(string clientId, string name)
    {
        int rows = 0;
        if (!String.IsNullOrEmpty(name))
        {
            await using var cmd = _db.CreateCommand("INSERT INTO users (user_id, name)" +
                                                    "VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name");
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


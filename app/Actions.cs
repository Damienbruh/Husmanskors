using System.Globalization;
using System.Reflection.Metadata;
using Npgsql;
using System.Security.Cryptography;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;

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
    public async Task<(bool, Game? game)> JoinSessionViaCode(string clientId, string gameCode)
    {
        if (String.IsNullOrEmpty(gameCode))
        {
            return (false, null);
        }

        Game game = null;

        await using var cmd = _db.CreateCommand("UPDATE games SET player_2 = NULL WHERE player_2 = $1 AND state = 'lobby'");
        cmd.Parameters.AddWithValue(clientId);
        await cmd.ExecuteNonQueryAsync();
        
        
        await using var cmd2 = _db.CreateCommand("UPDATE games SET player_2 = $1 WHERE player_2 IS NULL " + 
                                                 "AND gamecode = $2 AND state = 'lobby' RETURNING game_id, player_1");
        cmd2.Parameters.AddWithValue(clientId);
        cmd2.Parameters.AddWithValue(gameCode);
        await using (var reader = await cmd2.ExecuteReaderAsync())
        {
            List<(int id, string cId)> results = new List<(int id, string cId)>();
            while (await reader.ReadAsync())
            {
                results.Add((reader.GetInt32(0), reader.GetString(1)));
            }

            if (results.Count == 1)
            {
                return (true, new Game(results[0].id, results[0].cId, clientId, "lobby", gameCode));
            }
        }
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

    public async Task AddIdToDb(string clientId)
    {
        await using var cmd = _db.CreateCommand("INSERT INTO users (user_id)" +
                                                "VALUES ($1) ON CONFLICT (user_id) DO NOTHING");
        cmd.Parameters.AddWithValue(clientId);
        await cmd.ExecuteNonQueryAsync();
    }
}


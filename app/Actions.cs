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
    
    

        // Task: Disconnect from the game
        public async Task<bool> Disconnect(int gameId, string playerId)
        {
            await using var cmd = _db.CreateCommand("SELECT state, player_1, player_2 FROM games WHERE game_id = $1");
            cmd.Parameters.AddWithValue(gameId);
            await using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                string state = reader.GetString(0);
                string player1 = reader.GetString(1);
                string player2 = reader.IsDBNull(2) ? null : reader.GetString(2);

                if (player1 == playerId || player2 == playerId)
                {
                    if (state == "lobby")
                    {
                        // Ta bort spelet från databasen om det är i "lobby"-status
                        await using var deleteCmd = _db.CreateCommand("DELETE FROM games WHERE game_id = $1");
                        deleteCmd.Parameters.AddWithValue(gameId);
                        int affectedRows = await deleteCmd.ExecuteNonQueryAsync();
                        return affectedRows > 0;
                    }
                    else if (state == "active")
                    {
                        // Uppdatera spelets status till "ended" om det är i "active"-status
                        await using var updateCmd = _db.CreateCommand("UPDATE games SET state = 'ended' WHERE game_id = $1");
                        updateCmd.Parameters.AddWithValue(gameId);
                        int affectedRows = await updateCmd.ExecuteNonQueryAsync();
                        return affectedRows > 0;
                    }
                }
            }

            return false;
        }

        // Task: Get the game status
        public async Task<string> GetGameStatus(int gameId)
        {
            await using var cmd = _db.CreateCommand("SELECT state FROM games WHERE game_id = $1");
            cmd.Parameters.AddWithValue(gameId);
            await using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return reader.GetString(0);
            }

            return null;
        }
    }



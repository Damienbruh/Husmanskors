using Npgsql;

namespace app;

public class Actions
{
    public async Task<(bool, Game game)> NewSession(string clientId)
    {
        Game game = null;
        game = new Game(1, clientId, "2", "state", "gamecode");
        return game != null ? (true, game) : (false, game);
    }
    public async Task<(bool, Game game)> JoinSessionViaCode(string clientId, string gameCode)
    {
        Game game = null;
        return game != null ? (true, game) : (false, null);
    }
    
    
}


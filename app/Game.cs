namespace app;

public class Game
{
    public int _Id;
    public string _player1;
    public string _player2;
    public string _state;
    public string _gameCode;
    public Game(int Id, string Player1, string? Player2, string state, string GameCode)
    {
        _Id = Id;
        _player1 = Player1;
        _player2 = Player2;
        _state = state;
        _gameCode = GameCode;
    }
}
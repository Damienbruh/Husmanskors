namespace app
{

    public class EndTurnRequest
    {
        public required string GameId { get; set; }
        public required string PlayerId { get; set; }
    }
}
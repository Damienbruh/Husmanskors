namespace app
{
    public class DisconnectRequest
    {
        public required string GameId { get; set; }
        public required string PlayerId { get; set; }
    }
    
}
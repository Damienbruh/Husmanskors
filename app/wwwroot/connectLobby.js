document.getElementById('connectLobbyForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const gameCode = document.getElementById('gameCode').value;

    
    const response = await fetch('/connect-lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ GameCode: gameCode })
    });

    
    const result = await response.json();
    if (response.ok) {
        alert('Connected to the lobby!');
        // Redirect to the game page or update UI
    } else {
        alert('Failed to connect to the lobby.');
    }
});

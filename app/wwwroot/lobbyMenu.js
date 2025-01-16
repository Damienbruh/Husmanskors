document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createLobbyButton').addEventListener('click', function() {
        window.location.href = '/CreateGameMenu.html';
    });

    document.getElementById('connectLobbyButton').addEventListener('click', function() {
        window.location.href = '/ConnectLobby.html';
    });
});
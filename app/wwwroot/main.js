let players = [];
let thisPlayer = {}; // store User object that is returned from http request

$('#SessionForm').on("click", "button", async function(event) {
    event.preventDefault(); // Prevent default behavior, like form submission
    const clickedButtonId = $(this).attr('id'); // Get the ID of the clicked button
    console.log(clickedButtonId);
    var gameCode = null;
    let response;
    switch(clickedButtonId){
        case "connectOptions":
            await ChangeNameRequest();
            console.log("CreateGameButton button clicked!");
            break;
        case "ConnectSessionViaCode":
            await ChangeNameRequest();
            // Handle ConnectSessionCode button click
            console.log("ConnectSessionCode button clicked!");
            gameCode = $('#gamecode').val();
            console.log(gameCode);
            console.log(gameCode);

            response = await fetch('/join-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    connectType: clickedButtonId,
                    GameCode: gameCode
                })
            });
            break;
        case "ChangeName":
            await ChangeNameRequest();
            break;
    }
    
    async function ChangeNameRequest(){
        const name = $('#playerName').val();
        console.log('playerName', name);
        response = await fetch('/changeName', { // post (save new)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        console.log('response', response);
        $('#message').text(thisPlayer.name + ' lades till i databasen')
    }
    
    console.log('response', response);
    console.log('header type:  ', response.headers.get('Content-Type'));
    const data = await response.json();
    console.log("data", data);
});

$(document).ready(function() {
    // Variabler för att lagra spelets ID och spelarens ID
    let gameId;
    let playerId;

    // Funktion för att hämta spelets status från servern
    async function getGameStatus() {
        const response = await fetch(`/game-status?gameId=${gameId}`);
        if (response.ok) {
            const data = await response.json();
            return data.state;
        } else {
            console.log("Kunde inte hämta spelets status.");
            return null;
        }
    }

    // Funktion för att initiera spelet och sätta spelets ID och spelarens ID
    async function initGame() {
        // Få spelets ID och spelarens ID automatiskt (t.ex. från cookies)
        gameId = getCookie("gameId");
        playerId = getCookie("ClientId");
        if (!gameId || !playerId) {
            console.log("Spelets ID eller spelarens ID är ogiltigt.");
            return;
        }

        const gameState = await getGameStatus();
        if (gameState === "active") {
            $('#forfeitRound').show(); // Visa knappen om spelets status är "active"
            $('#endTurn').show(); // Visa knappen om spelets status är "active"
        } else if (gameState === "lobby" || gameState === "active") {
            $('#disconnectGame').show(); // Visa knappen om spelets status är "lobby" eller "active"
        } else {
            console.log("Spelet är inte i ett tillstånd där det kan kopplas från.");
        }
    }

    // Funktion för att hämta cookie-värde
    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // Kör initiering när sidan laddas
    initGame();

    // Hantera klickhändelse för att koppla från spelet (Task: Disconnect game)
    $('#disconnectGame').on('click', async function() {
        const response = await fetch('/disconnect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: gameId, playerId: playerId })
        });
        const messageElement = $('#message');

        if (response.ok) {
            const data = await response.json();
            messageElement.text("Du har kopplats från spelet.");
            $('#disconnectGame').hide(); // Dölj knappen efter att spelet har kopplats från
        } else {
            messageElement.text("Kunde inte koppla från spelet.");
        }
    });

    // Hantera klickhändelse för att ge upp rundan (Task: Forfeit a round)
    $('#forfeitRound').on('click', async function() {
        const response = await fetch('/forfeit-round', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: gameId, playerId: playerId })
        });
        const messageElement = $('#message');

        if (response.ok) {
            const data = await response.json();
            messageElement.text("Rundan förlorades framgångsrikt.");
            $('#forfeitRound').hide(); // Dölj knappen efter att rundan har förlorats
        } else {
            messageElement.text("Kunde inte förlora rundan.");
        }
    });

    // Hantera klickhändelse för att avsluta turen (Task: End turn early)
    $('#endTurn').on('click', async function() {
        const response = await fetch('/end-turn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId: gameId, playerId: playerId })
        });
        const messageElement = $('#message');

        if (response.ok) {
            const data = await response.json();
            messageElement.text("Din tur har avslutats.");
            $('#endTurn').hide(); // Dölj knappen efter att turen har avslutats
        } else {
            messageElement.text("Kunde inte avsluta turen.");
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('connectOptions').addEventListener('click', function() {
        window.location.href = '/CreateGameMenu.html'; // Replace with your target URL
    });
});


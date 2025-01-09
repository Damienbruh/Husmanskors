let players = [];
let thisPlayer = {}; // store User object that is returned from http request

$('#SessionForm').on("click", "button", async function(event) {
    event.preventDefault(); // Prevent default behavior, like form submission
    const clickedButtonId = $(this).attr('id'); // Get the ID of the clicked button
    console.log(clickedButtonId);
    var gameCode = null;
    let response;
    switch(clickedButtonId){
        case "StartSession":
            await ChangeNameRequest();
            // Handle StartSession button click
            console.log("StartSession button clicked!");

            response = await fetch('/join-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    connectType: clickedButtonId,
                    GameCode: gameCode
                })
            });
            
            break;
        case "ConnectSessionViaCode":
            await ChangeNameRequest();
            // Handle ConnectSessionCode button click
            console.log("ConnectSessionCode button clicked!");
            gameCode = $('#gamecode'.val());
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
    const data = await response.json();
    console.log("data", data);
});

$(document).ready(function() {
    // Funktion för att hämta spelets status från servern
    async function getGameStatus() {
        let response = await fetch(`/game-status`);
        if (response.ok) {
            let data = await response.json();
            return data.state;
        } else {
            console.log("Kunde inte hämta spelets status.");
            return null;
        }
    }

    // Funktion för att initiera spelet och sätta spelets ID i en cookie
    async function initGame() {
        const gameId = getCookie("gameId"); // Hämta spelets ID från cookien
        if (!gameId) {
            console.log("Spelets ID är ogiltigt.");
            return;
        }

        const gameState = await getGameStatus();
        if (gameState === "lobby" || gameState === "active") {
            $('#disconnect').show(); // Visa knappen om spelets status är "lobby" eller "active"
        } else {
            console.log("Spelet är inte i ett tillstånd där det kan kopplas från.");
        }
    }

    // Funktion för att hämta en cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Kör initiering när sidan laddas
    initGame();

    // Hantera klickhändelse för att koppla från spelet
    $('#disconnect').on('click', async function() {
        let response = await fetch(`/disconnect`, { method: 'POST' });
        if (response.ok) {
            console.log("Du har kopplats från spelet.");
            $('#disconnect').hide(); // Dölj knappen efter att spelet har kopplats från
        } else {
            console.log("Kunde inte koppla från spelet.");
        }
    });
});

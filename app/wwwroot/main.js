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
            ChangeNameRequest();
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
            ChangeNameRequest();
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
            ChangeNameRequest();
            break;
        case "ChangeName":
            ChangeNameRequest();
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
    async function getGameStatus(gameId) {
        let response = await fetch(`/game-status?gameId=${gameId}`);
        if (response.ok) {
            let data = await response.json();
            return data.state;
        } else {
            console.log("Kunde inte hämta spelets status.");
            return null;
        }
    }

    // Kontrollera spelets status och visa knappen om spelet är i "lobby" eller "active" status
    async function checkGameStatus() {
        const gameId = prompt("Ange spelets ID:");
        if (!gameId) {
            console.log("Spelets ID är ogiltigt.");
            return;
        }

        const gameState = await getGameStatus(gameId);
        if (gameState === "lobby" || gameState === "active") {
            $('#endGame').show(); // Visa knappen om spelets status är "lobby" eller "active"
        } else {
            console.log("Spelet är inte i ett tillstånd där det kan avslutas.");
        }
    }

    // Kör kontrollen när sidan laddas
    checkGameStatus();

    // Hantera klickhändelse för att avsluta spelet
    $('#endGame').on('click', async function() {
        const gameId = prompt("Bekräfta spelets ID för att avsluta:");
        if (!gameId) {
            console.log("Spelets ID är ogiltigt.");
            return;
        }

        let response = await fetch(`/end-game?gameId=${gameId}`, { method: 'POST' });
        if (response.ok) {
            console.log("Spelet avslutades framgångsrikt.");
            $('#endGame').hide(); // Dölj knappen efter att spelet avslutats
        } else {
            console.log("Kunde inte avsluta spelet.");
        }
    });
});

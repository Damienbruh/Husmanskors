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
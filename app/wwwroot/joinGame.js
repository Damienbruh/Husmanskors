$('#SessionForm').on("click", "button", async function(event) {
    event.preventDefault(); // Prevent default behavior, like form submission

    const clickedButtonId = $(this).attr('id'); // Get the ID of the clicked button
    var gameCode = null;
    let response;
    if (clickedButtonId === "StartSession") {
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
        
    } else if (clickedButtonId === "ConnectSessionViaCode") {
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
    }
    
    console.log('response', response);
    const data = await response.json();
    console.log("data", data);
});
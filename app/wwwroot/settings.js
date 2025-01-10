
const roundTimeInput = document.getElementById('round-time');
const numberOfRoundsInput = document.getElementById('number-of-rounds');
const extraPointsCheckbox = document.getElementById('extra-points');


//Just nu bara ger den logs i consolen för inputsen man gör i menyn
//**TODO
// *Lägga till funktionerna för knapparna så dem modifererars

let roundTimeInput = 40;          // round-time
let numberOfRoundsInput = 2;      // number-of-rounds
let extraPointsCheckbox = false; // Boolean extra-points

const defaultSettings = [
    roundTimeInput,
    numberOfRoundsInput,
    extraPointsCheckbox
];

roundTimeInput.addEventListener('input', () => {
    console.log('Rundtid:', roundTimeInput.value);
    //** Koden går här för att modiferar default settingsarna
    
});

numberOfRoundsInput.addEventListener('input', () => {
    console.log('Antal rundor:', numberOfRoundsInput.value);
    //** Koden går här för att modiferar default settingsarna
});

extraPointsCheckbox.addEventListener('change', () => {
    console.log('Extra poängs rutor:', extraPointsCheckbox.checked);
    //** Koden går här för att modiferar default settingsarna
});

$('#SessionForm').on("click", "button", async function(event) {
    event.preventDefault(); // Prevent default behavior, like form submission
    const clickedButtonId = $(this).attr('id'); // Get the ID of the clicked button
    console.log(clickedButtonId);
    var gameCode = null;
    let response;
    switch(clickedButtonId) {
        case "StartSession":
            // Handle StartSession button click
            console.log("StartSession button clicked!");

            response = await fetch('/join-session', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    connectType: clickedButtonId,
                    GameCode: gameCode
                })
            });

            break;
        }

    console.log('response', response);
    const data = await response.json();
    console.log("data", data);
});
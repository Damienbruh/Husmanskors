
const roundTimeInputE = document.getElementById('round-time');
const numberOfRoundsInputE = document.getElementById('number-of-rounds');
const extraPointsCheckboxE = document.getElementById('extra-points');
const wordLengthInputE = document.getElementById('word-length');


//Just nu bara ger den logs i consolen för inputsen man gör i menyn
//**TODO
// *Lägga till funktionerna för knapparna så dem modifererars

let roundTimeInput = 40;          // round-time
let numberOfRoundsInput = 2;      // number-of-rounds
let extraPointsCheckbox = false; // Boolean extra-points
let wordLengthInput = 11; // word-length

const defaultSettings = {
    roundTimeInput,
    numberOfRoundsInput,
    extraPointsCheckbox,
    wordLengthInput
};

roundTimeInputE.addEventListener('input', function (event) {
    //** Koden går här för att modiferar default settingsarna
    roundTimeInput = parseInt(event.target.value)
    defaultSettings[0] = roundTimeInput;
    console.log('Rundtid:', defaultSettings);
});

numberOfRoundsInputE.addEventListener('input', function (event) {
    //** Koden går här för att modiferar default settingsarna
    numberOfRoundsInput = parseInt(event.target.value)
    defaultSettings[1] = numberOfRoundsInput
    console.log('Antal Rundor:', defaultSettings)
});

// Addat ordlängd funktion
wordLengthInputE.addEventListener('input', function (event) { 
    wordLengthInput = parseInt(event.target.value); 
    defaultSettings[3] = wordLengthInput; 
    console.log('Ord Längd:', defaultSettings); });

extraPointsCheckboxE.addEventListener('change', function (event) {
    //** Koden går här för att modiferar default settingsarna
    extraPointsCheckbox = event.target.checked
    defaultSettings[2] = extraPointsCheckbox
    console.log('Extra Poäng Rutor:', defaultSettings)
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
                    GameCode: gameCode,
                    Settings: defaultSettings
                })
            });
            break;
        default:
            console.log("Button does not exist")
            return;
        }

    console.log('response', response);
    const data = await response.json();
    console.log("data", data);
});
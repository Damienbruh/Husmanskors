
const roundTimeInputE = document.getElementById('round-time');
const numberOfRoundsInputE = document.getElementById('number-of-rounds');
const extraPointsCheckboxE = document.getElementById('extra-points');
const wordLengthInputE = document.getElementById('word-length');


let roundTimeInput = 40;
let numberOfRoundsInput = 2;
let extraPointsCheckbox = false;
let wordLengthInput = 11;


const defaultSettings = {
    roundTimeInput,
    numberOfRoundsInput,
    extraPointsCheckbox,
    wordLengthInput
};


roundTimeInputE.addEventListener('input', function (event) {
    roundTimeInput = parseInt(event.target.value)
    defaultSettings[0] = roundTimeInput;
    console.log('Rundtid:', defaultSettings);
});


numberOfRoundsInputE.addEventListener('input', function (event) {
    numberOfRoundsInput = parseInt(event.target.value)
    defaultSettings[1] = numberOfRoundsInput
    console.log('Antal Rundor:', defaultSettings)
});


wordLengthInputE.addEventListener('input', function (event) { 
    wordLengthInput = parseInt(event.target.value); 
    defaultSettings[3] = wordLengthInput; 
    console.log('Ord Längd:', defaultSettings); });

extraPointsCheckboxE.addEventListener('change', function (event) {
    extraPointsCheckbox = event.target.checked
    defaultSettings[2] = extraPointsCheckbox
    console.log('Extra Poäng Rutor:', defaultSettings)
});


$('#SessionForm').on("click", "button", async function(event) {
    event.preventDefault();
    const clickedButtonId = $(this).attr('id');
    console.log(clickedButtonId);
    var gameCode = null;
    let response;
    switch(clickedButtonId) {
        case "StartSession":
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
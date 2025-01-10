
const roundTimeInput = document.getElementById('round-time');
const numberOfRoundsInput = document.getElementById('number-of-rounds');
const extraPointsCheckbox = document.getElementById('extra-points');


//Just nu bara ger den logs i consolen för inputsen man gör i menyn
//**TODO
// *Lägga till funktionerna för knapparna så dem modifererars
roundTimeInput.addEventListener('input', () => {
    console.log('Rundtid:', roundTimeInput.value);
    
});

numberOfRoundsInput.addEventListener('input', () => {
    console.log('Antal rundor:', numberOfRoundsInput.value);
    
});

extraPointsCheckbox.addEventListener('change', () => {
    console.log('Extra poängs rutor:', extraPointsCheckbox.checked);
    
});

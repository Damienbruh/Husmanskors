
let players = [];
let thisPlayer = {};

async function getPlayers() {
    const response = await fetch('/players/1'); // get (read) players from a game (id)
    console.log('response', response);
    players = await response.json();
    console.log('fetched players', players)
    if (players.length < 2) { // if we don't have two players we can't play
        $('#message2').text("We need TWO players, you only have " + players.length)
        return;
    }
    // let's use the last two players in the array (not proper)
    players[0] = players[players.length - 2];
    players[1] = players[players.length - 1];
    players.length = 2;
}
// load players 

async function addPlayer(e) {
    e.preventDefault(); // not reload page on form submit
    const name = $('[name="playerName"]').val();
    console.log('playerName', name);
    const response = await fetch('/add-player/', { // post (save new)
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName })
    });
    console.log('response', response);
    const data = await response.json();
    console.log('data', data);
    thisPlayer = data;
    $('#message').text(thisPlayer.name + ' lades till i databasen')
    // load players (so we get any update or new player)
    getPlayers();
}
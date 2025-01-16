const tile = $(".letterUI > * > .tile")

tile.hover(function(){
    $(this).animate({"background-color": "#ffdead"}, {queue: false, duration: 200});
}, function(){
    $(this).animate({"background-color": "#faebd7"}, {queue: false, duration: 200});
});

$(function() {
    tile.draggable();
    $(".grid-item").droppable({
        drop: async function(event, ui) {
            if ($(this).children().length < 1) {
                const clone = $(ui.draggable).clone().appendTo($(this));
                clone.css({"top":"", "left":"", "background-color": "#faebd7", "border": "1px solid"});
                clone.addClass("placed-tile");
            } else {
                $(ui.draggable).animate({"background-color": "#cd5c5c"}, {queue: true, duration: 10});
                $(ui.draggable).animate({"background-color": "#faebd7"}, {queue: true, duration: 500});
            }
            console.log("before call update and score 1")
            await validateAndUpdateScore(); // Validera och uppdatera poäng när en tile placeras
        }
    });
});

$(document).ready(function() {
    $('.grid-item').on('dblclick', async function() {
        if ($(this).children('.placed-tile').length > 0) {
            $(this).children('.placed-tile').remove();
            console.log("before call update and  2")
            await validateAndUpdateScore(); // Validera och uppdatera poäng när en tile tas bort
        }
    });
});

tile.mouseup(function() {
    tile.animate({"top":"", "left":""}, {queue: false});
})

// Add event listener for double-click to remove a placed tile
$(document).ready(function() {
    $('.grid-item').on('dblclick', function() {
        // Check if there's a placed tile
        if ($(this).children('.placed-tile').length > 0) {
            $(this).children('.placed-tile').remove(); // Remove the placed tile
        }
    });
});
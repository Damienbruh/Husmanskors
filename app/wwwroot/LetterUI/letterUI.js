var tile = $(".letterUI > * > .tile")

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
                await validateAndUpdateScore(); // Validera och uppdatera poäng när en tile placeras
            } else {
                $(ui.draggable).animate({"background-color": "#cd5c5c"}, {queue: true, duration: 10});
                $(ui.draggable).animate({"background-color": "#faebd7"}, {queue: true, duration: 500});
            }
        }
    });
});

$(document).ready(function() {
    $('.grid-item').on('dblclick', async function() {
        if ($(this).children('.placed-tile').length > 0) {
            $(this).children('.placed-tile').remove();
            await validateAndUpdateScore(); // Validera och uppdatera poäng när en tile tas bort
        }
    });
});



tile.mouseup(function() {
    tile.animate({"top":"", "left":""}, {queue: false});
})

// $(".grid-item").hover(function () {
//    
// });





// function handle_mousedown(e){
//     window.my_dragging = {}
//     my_dragging.pageX0 = e.pageX;
//     my_dragging.pageY0 = e.pageY;
//     my_dragging.elem = this;
//     my_dragging.offset0 = $(this).offset();
//    
//     function handle_dragging(e){
//         var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
//         var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
//         $(my_dragging.elem).offset({top: top, left: left});
//     }
//    
//     function handle_mouseup(e){
//         $('body').off('mousemove', handle_dragging).off('mouseup', handle_mouseup);
//     }
//    
//     $('body').on('mouseup', handle_mouseup).on('mousemove', handle_dragging);
// }
//
// $('.tile').mousedown(handle_mousedown)


// Add event listener for double-click to remove a placed tile
$(document).ready(function() {
    $('.grid-item').on('dblclick', function() {
        // Check if there's a placed tile
        if ($(this).children('.placed-tile').length > 0) {
            $(this).children('.placed-tile').remove(); // Remove the placed tile
        }
    });
});

// Existerande kod för draggable
var tile = $(".letterUI > * > .tile")

tile.hover(function(){
    $(this).animate({"background-color": "#ffdead"}, {queue: false, duration: 200});
}, function(){
    $(this).animate({"background-color": "#faebd7"}, {queue: false, duration: 200});
});

$(function() {
    tile.draggable();

    $(".grid-item").droppable({
        drop: function(event, ui) {
            if($(this).children().length < 1) {
                const clone = $(ui.draggable).clone().appendTo($(this));
                clone.css({"top":"", "left":"", "background-color": "#faebd7", "border": "1px solid"});
                clone.addClass("placed-tile");
            } else {
                $(ui.draggable).animate({"background-color": "#cd5c5c"}, {queue: true, duration: 10});
                $(ui.draggable).animate({"background-color": "#faebd7"}, {queue: true, duration: 500});
            }
        }
    });
});

tile.mouseup(function() {
    tile.animate({"top":"", "left":""}, {queue: false});
});

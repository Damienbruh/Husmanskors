var tile = $(".tile")

tile.hover(function(){
    $(this).css("background-color", "navajowhite");
}, function(){
    $(this).css("background-color", "antiquewhite");
});

$( function() {
    $( ".tile" ).draggable();
} );

tile.mouseup(function() {
    $(".tile").animate({"top":"", "left":""});
})







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
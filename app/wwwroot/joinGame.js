$('#SessionForm').on("click", "button", function(event) {
    event.preventDefault(); // Prevent default behavior, like form submission

    const clickedButtonId = $(this).attr('id'); // Get the ID of the clicked button

    if (clickedButtonId === "StartSession") {
        // Handle StartSession button click
        console.log("StartSession button clicked!");
        
        
        
    } else if (clickedButtonId === "ConnectSessionCode") {
        // Handle ConnectSessionCode button click
        console.log("ConnectSessionCode button clicked!");
        console.log($('#gamecode').val());
        
        
        
    }
});
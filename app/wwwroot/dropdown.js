document.addEventListener("DOMContentLoaded", () => {
    const dropdownContainer = document.querySelector(".dropdown-container")
    const dropdownButton = document.querySelector(".dropdown-button")

    dropdownButton.addEventListener("click", () => {
        dropdownContainer.classList.toggle("show")
    })
    
    document.addEventListener("click", (event) => {
        if (!dropdownContainer.contains(event.target)) {
            dropdownContainer.classList.remove("show")
        }
    })
})
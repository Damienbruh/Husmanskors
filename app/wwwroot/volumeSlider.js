document.addEventListener("DOMContentLoaded", () => {
    const volumeSilder = document.getElementById("volume-sliderl");
    const audioElements = document.querySelectorAll("audio")
    
    audioElements.forEach(media => {
        media.volume = volumeSilder.value;
    })
    
    volumeSilder.addEventListener("input", () => {
        audioElements.forEach(media => {
            media.volume = volumeSilder.value;
        })
    })
})
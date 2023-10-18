let lastVideoId = null; // Keep track of the last video ID

function replaceWithIframe() {
    // Get the video ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");

    // If videoId is the same as the last one, return
    if (videoId === lastVideoId) {
        return;
    }

    lastVideoId = videoId; // Update the last video ID
  
    // Look for an existing iframe that the script may have inserted
    const existingIframe = document.querySelector("iframe[data-replaced='true']");
    
    if (existingIframe) {
      // If we've already replaced the player, just update the src attribute
      existingIframe.src = `https://www.youtube.com/embed/${videoId}?modestbranding=1&controls=1`;
      return;
    }
  
    const playerDiv = document.getElementById("player");
    if (!playerDiv) {
      // If the player isn't loaded yet, try again in a bit
      setTimeout(replaceWithIframe, 500);
      return;
    }
  
    if (!videoId) {
      return;
    }
  
    // Create a new iframe and replace the existing player div
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?modestbranding=1&controls=1`;
    iframe.width = playerDiv.clientWidth;
    iframe.height = playerDiv.clientHeight;
    
    // Set a custom data attribute to mark this iframe as having replaced the player
    iframe.setAttribute("data-replaced", "true");
  
    playerDiv.parentNode.replaceChild(iframe, playerDiv);
}

// Add a popstate event listener to detect URL changes
window.addEventListener('popstate', function(event) {
  replaceWithIframe();
});

// Also use setInterval to check for changes every second
// This will now only replace the iframe if the video ID changes
setInterval(replaceWithIframe, 1000);

// Wait for the DOM to be fully loaded before calling the function
document.addEventListener('DOMContentLoaded', (event) => {
  replaceWithIframe();
});

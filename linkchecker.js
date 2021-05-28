document.getElementById('clickme').addEventListener("click", function () {
    chrome.tabs.executeScript({ file: './foreground.js' });
})
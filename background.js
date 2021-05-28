/*.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var url = tab.url;
    if (url !== undefined && changeInfo.status == "complete") {
        chrome.tabs.insertCSS(null, { file: './style.css' });
        chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('foreground test'));
    }
}); */
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "AI-Detector-Fooler",
        title: "Text mit AI-Detector-Fooler umschreiben",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "AI-Detector-Fooler") {
        console.log("Ausgewählter Text:", info.selectionText);

    }
});
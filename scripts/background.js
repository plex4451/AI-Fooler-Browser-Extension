chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "AI-Detector-Fooler",
        title: "Text mit AI-Detector-Fooler umschreiben",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info) {
    if (info.menuItemId === "AI-Detector-Fooler") {
        var text = info.selectionText;
        console.log("Ausgewählter Text:", text);
        chrome.storage.local.set({ ["text"]: text }, function() {});
        openExtensionPage();
    }
});

function openExtensionPage() {
    // Get the URL of the extension's page
    var extensionPageUrl = chrome.runtime.getURL(`../popup/popup.html`);
    chrome.windows.create({
        url: extensionPageUrl,
        type: "popup",
        width: 500,
        height: 600,
        focused: true
    });
}
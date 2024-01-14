// Add a context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "selectText",
        title: "Text mit AI-Detector-Fooler umschreiben",
        contexts: ["selection"]
    });
});

// Event listener for context menu item clicks
chrome.contextMenus.onClicked.addListener(function(info) {
    // Check if the clicked menu item is "selectText"
    if (info.menuItemId === "selectText") {
        // Get the selected text
        var text = info.selectionText;
        console.log("Ausgewählter Text:", text);

        // Save the selected text to local storage
        chrome.storage.local.set({ ["text"]: text }, function() {});

        // Open the extension's popup page
        openExtensionPage();
    }
});

// Function to open the extension's popup page in a new popup window
function openExtensionPage() {
    // Get the URL of the extension's page
    var extensionPageUrl = chrome.runtime.getURL(`../popup/popup.html`);

    // Create a new popup window
    chrome.windows.create({
        url: extensionPageUrl,
        type: "popup",
        width: 500,
        height: 600,
        focused: true
    });
}

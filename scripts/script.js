document.addEventListener('DOMContentLoaded', function() {
    var changeTextButton = document.getElementById('changeTextButton');

    changeTextButton.addEventListener('click', function() {
        // Beispieltext
        var textToProcess = "Hallo";
        console.log("Sende Text: " + textToProcess);

        // Verwende Native Messaging, um das Python-Skript zu starten
        chrome.runtime.sendNativeMessage('ai_detector_fooler', { text: textToProcess }, function (response) {
            if (chrome.runtime.lastError) {
                console.log('Error:', chrome.runtime.lastError);
            } else {
                // Zeige die verarbeitete Antwort an
                console.log(response.processed_text)
            }
        });
    });
});
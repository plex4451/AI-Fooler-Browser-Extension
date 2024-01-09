document.addEventListener('DOMContentLoaded', function() {
    var changeTextButton = document.getElementById('changeTextButton');
    var textarea = document.getElementById('text');

    changeTextButton.addEventListener('click', function() {

        var text = textarea.value;
        console.log("Send message via messaging host: " + text);

        // Use messaging host to send the text to the python script
        chrome.runtime.sendNativeMessage('ai_detector_fooler', { text: text }, handleMessageResponse);
    });

    textarea.addEventListener('input', function () {
       resetInput(textarea);
    });
});

function handleMessageResponse(response) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }
    console.log("Response:", response);

    try {
        // If response is already an object, use it directly.
        var jsonResponse = typeof response === 'object' ? response : JSON.parse(response);
        var textarea = document.getElementById('text');
        textarea.value = jsonResponse.response;
        markInputAsSuccessful(textarea);
    } catch (error) {
        console.error("Error parsing JSON response:", error);
    }
}


function resetInput(input) {
    input.style.borderColor = "black";
}

function markInputAsSuccessful(input) {
    input.style.borderColor = "limegreen";
}
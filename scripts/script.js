document.addEventListener('DOMContentLoaded', function() {
    var changeTextButton = document.getElementById('changeTextButton');
    var textarea = document.getElementById('text');

    changeTextButton.addEventListener('click', function() {
        var text = textarea.value;
        sendTextToPythonScript(text);
    });

    textarea.addEventListener('input', function () {
       resetInput(textarea);
    });

    document.getElementById("newImage").addEventListener('click', function () {
        document.getElementById("selectImage").value = '';
        setVisibleImageInput(true);
        setVisibleLoading(false);
        setImagePathVisible(false);
    });

    document.getElementById("selectImage").addEventListener('change', fileSelectHandler);

    var dropArea = document.getElementById("drop-area");
    dropArea.addEventListener("drop", dropHandler);
    dropArea.addEventListener("dragover", dragOverHandler);
    dropArea.addEventListener("dragleave", dragLeaveHandler);

    setVisibleImageInput(true);
    setVisibleLoading(false);
    setImagePathVisible(false);

    chrome.storage.local.get(['text'], function(result) {
        const text = result.text;
        if(text !== undefined) {
            chrome.storage.local.remove('text', function() {});
            var textarea = document.getElementById('text');
            textarea.innerText = text;
            sendTextToPythonScript(text);
        }
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
        if(jsonResponse.hasOwnProperty("text_response")) {
            var textarea = document.getElementById('text');
            textarea.value = jsonResponse.text_response;
            markInputAsSuccessful(textarea);
        } else if(jsonResponse.hasOwnProperty("image_response")) {
            setVisibleLoading(false);
            setImagePathVisible(true);
            var imagePath = document.getElementById('imagePath');
            imagePath.value = jsonResponse.image_response;
        }

    } catch (error) {
        console.error("Error parsing JSON response:", error);
    }
}

function setHighlightDragAndDrop(highlight) {
    let dropArea = document.getElementById("drop-area");
    dropArea.style.borderColor = highlight ? "limegreen" : "darkgrey";
}

function setVisibleImageInput(visible) {
    let dropArea = document.getElementById("drop-area");
    let selectImage = document.getElementById("selectImage");
    dropArea.hidden = !visible;
    selectImage.hidden = !visible;
}

function setVisibleLoading(visible) {
    let loadingContainer = document.querySelector(".loading-container");
    loadingContainer.style.display = visible ? "Flex" : "None";
}

function setImagePathVisible(visible) {
    let containerImagePath = document.getElementById("containerImagePath");
    containerImagePath.style.display = visible ? "block" : "None";
}

function dragLeaveHandler(event) {
    event.preventDefault();
    setHighlightDragAndDrop(false);
}

function dragOverHandler(event) {
    event.preventDefault();
    setHighlightDragAndDrop(true);
}

function dropHandler(event) {
    event.preventDefault();
    setHighlightDragAndDrop(false);
    if (event.dataTransfer.items) {
        // Nutze DataTransferItemList Schnittstelle zum Zugriff auf das Bild
        var item = event.dataTransfer.items[0];

        if (item.kind === 'file' && item.type.startsWith('image/')) {
            var file = item.getAsFile();
            sendImageToPythonScript(file);
        } else {
            alert('Bitte ziehe nur Bilder hierher.');
        }
    }
}

function fileSelectHandler(event) {
    const file = event.target.files[0];
    if (file) {
        sendImageToPythonScript(file);
    }
}

function sendImageToPythonScript(image) {
    setVisibleImageInput(false);
    setVisibleLoading(true);
    // Read the image data as base64
    var reader = new FileReader();
    reader.onload = function (e) {
        var base64 = e.target.result;
        if (base64.startsWith("data:")) {
            // Remove the prefix
            base64 = base64.replace("data:image/jpeg;base64,", "");
            base64 = base64.replace("data:image/png;base64,", "");
        }

        // Use messaging host to send the image data to the python script
        console.log("Send message via messaging host: " + base64);
        chrome.runtime.sendNativeMessage('ai_detector_fooler', { image: base64 }, handleMessageResponse);
    };
    reader.readAsDataURL(image);
}

function sendTextToPythonScript(text) {
    // Use messaging host to send the text to the python script
    console.log("Send message via messaging host: " + text);
    chrome.runtime.sendNativeMessage('ai_detector_fooler', { text: text }, handleMessageResponse);
}


function resetInput(input) {
    input.style.borderColor = "black";
}

function markInputAsSuccessful(input) {
    input.style.borderColor = "limegreen";
}
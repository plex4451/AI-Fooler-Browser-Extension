// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var changeTextButton = document.getElementById('changeTextButton');
    var textarea = document.getElementById('text');

    // Event listener for the 'changeTextButton' click
    changeTextButton.addEventListener('click', function() {
        var text = textarea.value;
        sendTextToPythonScript(text);
    });

    // Event listener for the 'textarea' input
    textarea.addEventListener('input', function () {
        resetInput(textarea);
    });

    // Event listener for the 'newImage' click
    document.getElementById("newImage").addEventListener('click', function () {
        document.getElementById("selectImage").value = '';
        setVisibleImageInput(true);
        setVisibleLoading(false);
        setImagePathVisible(false);
    });

    // Event listener for the 'selectImage' change
    document.getElementById("selectImage").addEventListener('change', fileSelectHandler);

    // Event listener for the drop area
    var dropArea = document.getElementById("drop-area");
    dropArea.addEventListener("drop", dropHandler);
    dropArea.addEventListener("dragover", dragOverHandler);
    dropArea.addEventListener("dragleave", dragLeaveHandler);

    // Set initial visibility states
    setVisibleImageInput(true);
    setVisibleLoading(false);
    setImagePathVisible(false);

    // Check for stored text in Chrome storage
    chrome.storage.local.get(['text'], function(result) {
        const text = result.text;
        if(text !== undefined) {
            chrome.storage.local.remove('text', function() {});
            textarea.innerText = text;
            sendTextToPythonScript(text);
        }
    });
});

// Function to handle the response from the native messaging host
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

// Function to set the highlight for drag and drop
function setHighlightDragAndDrop(highlight) {
    let dropArea = document.getElementById("drop-area");
    dropArea.style.borderColor = highlight ? "limegreen" : "darkgrey";
}

// Function to set the visibility of the image input
function setVisibleImageInput(visible) {
    let dropArea = document.getElementById("drop-area");
    let selectImage = document.getElementById("selectImage");
    dropArea.hidden = !visible;
    selectImage.hidden = !visible;
}

// Function to set the visibility of the loading container
function setVisibleLoading(visible) {
    let loadingContainer = document.querySelector(".loading-container");
    loadingContainer.style.display = visible ? "flex" : "none";
}

// Function to set the visibility of the image path container
function setImagePathVisible(visible) {
    let containerImagePath = document.getElementById("containerImagePath");
    containerImagePath.style.display = visible ? "block" : "none";
}

// Function to send image data to the native messaging host
function sendImageToPythonScript(image) {
    setVisibleImageInput(false);
    setVisibleLoading(true);

    var reader = new FileReader();
    reader.onload = function (e) {
        var base64 = e.target.result;
        if (base64.startsWith("data:")) {
            base64 = base64.replace("data:image/jpeg;base64,", "");
            base64 = base64.replace("data:image/png;base64,", "");
        }

        console.log("Send message via messaging host: " + base64);
        chrome.runtime.sendNativeMessage('ai_detector_fooler', { image: base64 }, handleMessageResponse);
    };
    reader.readAsDataURL(image);
}

// Function to send text data to the native messaging host
function sendTextToPythonScript(text) {
    console.log("Send message via messaging host: " + text);
    chrome.runtime.sendNativeMessage('ai_detector_fooler', { text: text }, handleMessageResponse);
}

// Function to reset input styling
function resetInput(input) {
    input.style.borderColor = "black";
}

// Function to mark input as successful
function markInputAsSuccessful(input) {
    input.style.borderColor = "limegreen";
}

// Event listener for drag leave in the image drop zone
function dragLeaveHandler(event) {
    event.preventDefault();
    setHighlightDragAndDrop(false);
}

// Event listener for drag over in the image drop zone
function dragOverHandler(event) {
    event.preventDefault();
    setHighlightDragAndDrop(true);
}

// Event listener for drop in the image drop zone
function dropHandler(event) {
    event.preventDefault();
    setHighlightDragAndDrop(false);
    if (event.dataTransfer.items) {
        var item = event.dataTransfer.items[0];

        if (item.kind === 'file' && item.type.startsWith('image/')) {
            var file = item.getAsFile();
            sendImageToPythonScript(file);
        } else {
            alert('Bitte ziehe nur Bilder hierher.');
        }
    }
}

// Event listener for file select
function fileSelectHandler(event) {
    const file = event.target.files[0];
    if (file) {
        sendImageToPythonScript(file);
    }
}


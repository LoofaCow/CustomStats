// index.js
import { getContext } from "../../extensions.js";

// Add a status box UI
function createStatusBox() {
    const statusBox = document.createElement("div");
    statusBox.id = "status-box";
    statusBox.innerHTML = `
        <h3>Status Screen</h3>
        <div id="status-content">
            <p>Initializing...</p>
        </div>
    `;
    document.body.appendChild(statusBox);
}

// Update status dynamically
function updateStatus(message) {
    const statusContent = document.getElementById("status-content");
    if (statusContent) {
        statusContent.innerHTML = `<p>${message}</p>`;
    }
}

// Hook into events
function registerEventListeners() {
    const { eventSource, event_types } = getContext();

    eventSource.on(event_types.MESSAGE_SENT, (data) => {
        updateStatus(`Message sent: ${data.message}`);
    });

    eventSource.on(event_types.MESSAGE_RECEIVED, (data) => {
        updateStatus(`Message received: ${data.message}`);
    });

    eventSource.on(event_types.CHAT_CHANGED, (data) => {
        updateStatus(`Chat switched to: ${data.chatId}`);
    });
}

// Initialize the extension
(function initialize() {
    createStatusBox();
    registerEventListeners();
})();

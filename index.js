import { eventSource, event_types } from "../../../../script.js";
import { getContext, renderExtensionTemplateAsync, saveMetadataDebounced } from "../../../extensions.js";

const MODULE_NAME = "StatusTracker";

// User's status sheet
let statusSheet = {
    health: 100,
    stamina: 100,
    inventory: [],
};

// Update interval counter
let checkCounter = 0;

// Function to initialize the extension
function initializeExtension() {
    setupEventListeners();
    loadUI();
    loadSettings();
}

// Load UI elements into Silly Tavern
async function loadUI() {
    const settingsHtml = await renderExtensionTemplateAsync("third-party/Extension-StatusTracker", "settings");
    const container = document.getElementById("extensions_settings") || document.body;
    container.insertAdjacentHTML("beforeend", settingsHtml);

    // Attach event listeners to UI elements
    document.getElementById("reset-status").addEventListener("click", resetStatusSheet);
}

// Attach event listeners for chat events
function setupEventListeners() {
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    eventSource.on(event_types.CHAT_CHANGED, resetStatusSheet);
}

// Handle incoming messages
function onMessageReceived(event) {
    const message = event.message;
    processAIResponse(message);
    updateStatusUI();
}

// Process AI responses and update status sheet
function processAIResponse(message) {
    if (message.includes("damage")) {
        statusSheet.health = Math.max(0, statusSheet.health - 10);
    }
    if (message.includes("rest")) {
        statusSheet.stamina = Math.min(100, statusSheet.stamina + 20);
    }
    if (message.includes("found item")) {
        const item = extractItemFromMessage(message);
        if (item) {
            statusSheet.inventory.push(item);
        }
    }
}

// Extract an item from an AI response
function extractItemFromMessage(message) {
    const match = message.match(/found item: (\w+)/);
    return match ? match[1] : null;
}

// Update the UI to reflect the current status
function updateStatusUI() {
    const statusElement = document.getElementById("status-display");
    if (statusElement) {
        statusElement.innerText = JSON.stringify(statusSheet, null, 2);
    }
}

// Reset the status sheet
function resetStatusSheet() {
    statusSheet = {
        health: 100,
        stamina: 100,
        inventory: [],
    };
    updateStatusUI();
}

// Save settings
function saveSettings() {
    const context = getContext();
    context.chat_metadata[MODULE_NAME] = statusSheet;
    saveMetadataDebounced();
}

// Load settings from previous session
function loadSettings() {
    const context = getContext();
    if (context.chat_metadata[MODULE_NAME]) {
        statusSheet = context.chat_metadata[MODULE_NAME];
    }
    updateStatusUI();
}

// Initialize the extension on page load
document.addEventListener("DOMContentLoaded", initializeExtension);

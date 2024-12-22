// Main script for CustomStats extension

import {
    extension_settings,
    getContext,
    saveMetadataDebounced,
    renderExtensionTemplateAsync
} from '../../../extensions.js';
import {
    chat_metadata,
    saveSettingsDebounced,
    animation_duration,
    eventSource,
    event_types
} from '../../../../script.js';
import { dragElement } from '../../../../scripts/RossAscends-mods.js';

const MODULE_NAME = 'CustomStats';
const extensionFolderPath = 'scripts/extensions/third-party/CustomStats';
let statsData = {};

const defaultSettings = {
    userStats: {},
    enableAutoUpdate: true
};

// Load or initialize settings
async function loadSettings() {
    if (!extension_settings[MODULE_NAME]) {
        extension_settings[MODULE_NAME] = { ...defaultSettings };
    }
    statsData = extension_settings[MODULE_NAME].userStats;
    updateUI();
}

// Function to handle stat updates
function updateStat(statKey, value) {
    statsData[statKey] = value;
    saveSettingsDebounced();
    updateUI();
}

// Render stats UI dynamically
function updateUI() {
    const container = document.getElementById('custom-stats-container');
    container.innerHTML = '';

    Object.keys(statsData).forEach(statKey => {
        const statElement = document.createElement('div');
        statElement.className = 'stat-item';

        const label = document.createElement('span');
        label.textContent = `${statKey}: `;

        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.value = statsData[statKey];
        valueInput.addEventListener('input', (e) => updateStat(statKey, parseInt(e.target.value, 10)));

        statElement.appendChild(label);
        statElement.appendChild(valueInput);
        container.appendChild(statElement);
    });
}

// Add a new stat
function addStat(statKey, initialValue = 0) {
    if (!statsData[statKey]) {
        statsData[statKey] = initialValue;
        updateUI();
        saveSettingsDebounced();
    }
}

// Initialize the extension
jQuery(async () => {
    const settingsHtml = await renderExtensionTemplateAsync('third-party/CustomStats', 'settings');
    const container = document.getElementById('extensions_settings');
    container.innerHTML += settingsHtml;

    document.getElementById('add-stat-button').addEventListener('click', () => {
        const statKey = prompt('Enter new stat name:');
        if (statKey) {
            addStat(statKey);
        }
    });

    await loadSettings();

    eventSource.on(event_types.MESSAGE_RECEIVED, () => {
        if (extension_settings[MODULE_NAME].enableAutoUpdate) {
            // Placeholder for AI-driven update logic
            console.log('Auto-updating stats...');
        }
    });
});

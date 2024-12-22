// Import necessary modules
import { getContext } from "../../extensions.js";

// Initialize persistent storage
let stats = {
    health: 100,
    mana: 100,
    skills: [],
    attributes: [],
    relationships: [],
    journal: []
};

// Load existing stats from settings
function loadStats() {
    const context = getContext();
    stats = context.settings.get('userStats') || stats;
}

// Save stats to persistent storage
function saveStats() {
    const context = getContext();
    context.settings.set('userStats', stats);
}

// Create UI elements
function createUI() {
    const context = getContext();

    // Main container
    const container = document.createElement('div');
    container.id = 'user-stats-container';
    container.innerHTML = `
        <h3>User Stats</h3>
        <div>
            <label>Health:</label>
            <input type="number" id="health" value="${stats.health}" />
        </div>
        <div>
            <label>Mana:</label>
            <input type="number" id="mana" value="${stats.mana}" />
        </div>
        <div>
            <label>Skills:</label>
            <textarea id="skills">${stats.skills.join(', ')}</textarea>
        </div>
        <div>
            <label>Attributes:</label>
            <textarea id="attributes">${stats.attributes.join(', ')}</textarea>
        </div>
        <div>
            <label>Relationships:</label>
            <textarea id="relationships">${stats.relationships.join(', ')}</textarea>
        </div>
        <div>
            <label>Journal:</label>
            <textarea id="journal">${stats.journal.join('\\n')}</textarea>
        </div>
        <button id="save-stats">Save Stats</button>
    `;

    // Save button logic
    container.querySelector('#save-stats').addEventListener('click', () => {
        stats.health = parseInt(container.querySelector('#health').value, 10);
        stats.mana = parseInt(container.querySelector('#mana').value, 10);
        stats.skills = container.querySelector('#skills').value.split(',').map(s => s.trim());
        stats.attributes = container.querySelector('#attributes').value.split(',').map(a => a.trim());
        stats.relationships = container.querySelector('#relationships').value.split(',').map(r => r.trim());
        stats.journal = container.querySelector('#journal').value.split('\\n');
        saveStats();
        alert('Stats saved!');
    });

    // Append to the app
    const app = context.appContainer;
    app.appendChild(container);
}

// Main initialization function
export function init() {
    loadStats();
    createUI();
}

// Cleanup function for plugin shutdown
export function exit() {
    const container = document.getElementById('user-stats-container');
    if (container) container.remove();
}

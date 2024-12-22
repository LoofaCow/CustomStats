import { getContext } from "../../extensions.js";

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

// Inject the stats.html into Silly Tavern's interface
function injectTab() {
    const context = getContext();
    const appContainer = context.appContainer;

    // Load the HTML content
    fetch('./stats.html')
        .then(response => response.text())
        .then(html => {
            const div = document.createElement('div');
            div.innerHTML = html;
            appContainer.appendChild(div);

            // Attach event listeners to UI elements
            document.getElementById('stats-health').value = stats.health;
            document.getElementById('stats-mana').value = stats.mana;
            document.getElementById('stats-skills').value = stats.skills.join(', ');
            document.getElementById('stats-attributes').value = stats.attributes.join(', ');
            document.getElementById('stats-relationships').value = stats.relationships.join(', ');
            document.getElementById('stats-journal').value = stats.journal.join('\\n');

            document.getElementById('save-stats').addEventListener('click', () => {
                stats.health = parseInt(document.getElementById('stats-health').value, 10);
                stats.mana = parseInt(document.getElementById('stats-mana').value, 10);
                stats.skills = document.getElementById('stats-skills').value.split(',').map(s => s.trim());
                stats.attributes = document.getElementById('stats-attributes').value.split(',').map(a => a.trim());
                stats.relationships = document.getElementById('stats-relationships').value.split(',').map(r => r.trim());
                stats.journal = document.getElementById('stats-journal').value.split('\\n');
                saveStats();
                alert('Stats saved!');
            });
        });
}

// Main initialization function
export function init() {
    loadStats();
    injectTab();
}

// Cleanup function for plugin shutdown
export function exit() {
    const tab = document.querySelector('.user-stats-tab');
    if (tab) tab.remove();
}


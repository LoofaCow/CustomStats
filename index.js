export default {
    // Called when the extension is loaded
    initialize(state, api) {
        console.log("Status Sheet Extension Initialized!");

        // Create the Status Sheet tab
        api.addTab({
            id: "status-sheet-tab",
            icon: "📜", // Emoji or icon for the tab
            name: "Status Sheet",
            content: `
                <div id="status-sheet">
                    <h2>Status Sheet</h2>
                    <div class="stat-category">
                        <h3>Basic Stats</h3>
                        <label>Health: <input id="health" type="number" value="100" /></label>
                        <label>Mana: <input id="mana" type="number" value="50" /></label>
                        <label>Stamina: <input id="stamina" type="number" value="75" /></label>
                    </div>
                    <div class="stat-category">
                        <h3>Attributes</h3>
                        <label>Strength: <input id="strength" type="number" value="10" /></label>
                        <label>Agility: <input id="agility" type="number" value="10" /></label>
                        <label>Intelligence: <input id="intelligence" type="number" value="10" /></label>
                    </div>
                    <div class="stat-category">
                        <h3>Skills</h3>
                        <textarea id="skills">Skill 1: Level 1</textarea>
                    </div>
                    <div class="stat-category">
                        <h3>Relationships</h3>
                        <textarea id="relationships">NPC Name: Neutral</textarea>
                    </div>
                    <div class="stat-category">
                        <h3>Quests</h3>
                        <textarea id="quests">Quest 1: In Progress</textarea>
                    </div>
                    <button id="save-status">Save</button>
                </div>
            `,
        });

        // Add functionality to the Save button
        document.addEventListener("click", (event) => {
            if (event.target.id === "save-status") {
                const data = {
                    health: document.getElementById("health").value,
                    mana: document.getElementById("mana").value,
                    stamina: document.getElementById("stamina").value,
                    attributes: {
                        strength: document.getElementById("strength").value,
                        agility: document.getElementById("agility").value,
                        intelligence: document.getElementById("intelligence").value,
                    },
                    skills: document.getElementById("skills").value,
                    relationships: document.getElementById("relationships").value,
                    quests: document.getElementById("quests").value,
                };
                localStorage.setItem("statusSheet", JSON.stringify(data));
                alert("Status Saved!");
            }
        });

        // Load saved data if available
        const savedData = localStorage.getItem("statusSheet");
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById("health").value = data.health;
            document.getElementById("mana").value = data.mana;
            document.getElementById("stamina").value = data.stamina;
            document.getElementById("strength").value = data.attributes.strength;
            document.getElementById("agility").value = data.attributes.agility;
            document.getElementById("intelligence").value = data.attributes.intelligence;
            document.getElementById("skills").value = data.skills;
            document.getElementById("relationships").value = data.relationships;
            document.getElementById("quests").value = data.quests;
        }
    },
};

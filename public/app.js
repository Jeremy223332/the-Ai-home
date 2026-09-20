let selectedAIs = ["ChatGPT"];
let mode = "one";

const aiResponses = {
    ChatGPT: "Hello! I'm ChatGPT.",
    Gemini: "Hello! I'm Gemini.",
    Claude: "Hello! I'm Claude.",
    Copilot: "Hello! I'm Copilot.",
    Replit: "Hello! I'm Replit.",
    Framer: "Hello! I'm Framer."
};


// -----------------------------
// AI SELECTION
// -----------------------------

function selectAI(ai) {
    selectedAIs = [ai];

    document.querySelectorAll(".ai-option").forEach(option => {
        option.classList.remove("selected");
    });

    const selected = document.querySelector(`[data-ai="${ai}"]`);

    if (selected) {
        selected.classList.add("selected");
    }
}


// -----------------------------
// MODE SWITCHING
// -----------------------------

function setMode(newMode) {
    mode = newMode;

    document.querySelectorAll(".mode-button").forEach(button => {
        button.classList.remove("active");
    });

    const button = document.querySelector(
        `[data-mode="${newMode}"]`
    );

    if (button) {
        button.classList.add("active");
    }
}


// -----------------------------
// ADD MESSAGE
// -----------------------------

function addMessage(type, text) {
    const chat = document.getElementById("chat");

    if (!chat) {
        console.error("Chat element not found.");
        return null;
    }

    const message = document.createElement("div");

    message.className = `message ${type}`;

    const content = document.createElement("div");

    content.className = "message-content";
    content.textContent = text;

    message.appendChild(content);
    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

    return message;
}


// -----------------------------
// KEYBOARD
// -----------------------------

function handleKey(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}


// -----------------------------
// SEND MESSAGE
// -----------------------------

async function sendMessage() {

    const input = document.getElementById("messageInput");

    if (!input) {
        console.error("messageInput not found.");
        return;
    }

    const text = input.value.trim();

    if (!text) {
        return;
    }

    if (selectedAIs.length === 0) {
        addMessage("system", "Please select an AI first.");
        return;
    }

    addMessage("user", text);

    input.value = "";

    // -------------------------
    // CHATGPT
    // -------------------------

    if (mode === "one" && selectedAIs[0] === "ChatGPT") {

        const thinkingMessage = addMessage(
            "ai",
            "ChatGPT is thinking..."
        );

        try {

            const response = await fetch("/api/chat", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: text
                })
            });

            const data = await response.json();

            if (data.response) {

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent = data.response;

            } else {

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    "Error: " + (data.error || "Unknown error");

            }

        } catch (error) {

            console.error("ChatGPT error:", error);

            thinkingMessage.querySelector(
                ".message-content"
            ).textContent =
                "Could not connect to the AI server.";

        }

        return;
    }


    // -------------------------
    // DEMO AI
    // -------------------------

    if (mode === "one") {

        const ai = selectedAIs[0];

        setTimeout(() => {

            addMessage(
                "ai",
                aiResponses[ai] ||
                `${ai} is currently in demo mode.`
            );

        }, 500);

        return;
    }


    // -------------------------
    // AI COUNCIL
    // -------------------------

    if (mode === "council") {

        for (const ai of selectedAIs) {

            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );

            addMessage(
                "ai",
                `${ai}: I'm considering your question.`
            );
        }
    }
}


// -----------------------------
// STARTUP
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("messageInput");

    if (input) {
        input.addEventListener("keydown", handleKey);
    }

});

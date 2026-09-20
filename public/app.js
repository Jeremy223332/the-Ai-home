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

    console.log("Selected AI:", ai);
}


// -----------------------------
// MODE SWITCHING
// -----------------------------

function setMode(newMode) {
    mode = newMode;

    console.log("Mode changed to:", mode);

    document.querySelectorAll(".mode-button").forEach(button => {
        button.classList.remove("active");
    });

    document.querySelectorAll(".mode-button").forEach(button => {
        const buttonText = button.textContent.trim().toLowerCase();

        if (
            (newMode === "one" && buttonText.includes("one ai")) ||
            (newMode === "council" && buttonText.includes("ai council"))
        ) {
            button.classList.add("active");
        }
    });
}


// -----------------------------
// ADD AI
// -----------------------------

function addAI() {
    const aiName = prompt("Enter the AI name:");

    if (!aiName) {
        return;
    }

    if (selectedAIs.includes(aiName)) {
        alert(`${aiName} is already selected.`);
        return;
    }

    selectedAIs.push(aiName);

    console.log("Added AI:", aiName);
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
    // ONE AI MODE
    // -------------------------

    if (mode === "one") {

        const selectedAI = selectedAIs[0];

        console.log("Sending to:", selectedAI);


        // CHATGPT
        if (selectedAI === "ChatGPT") {

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

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    data.response ||
                    "ChatGPT error: " +
                    (data.error || "Unknown error");

            } catch (error) {

                console.error("ChatGPT error:", error);

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    "Could not connect to ChatGPT.";
            }

            return;
        }


        // GEMINI
        if (selectedAI === "Gemini") {

            const thinkingMessage = addMessage(
                "ai",
                "Gemini is thinking..."
            );

            try {

                const response = await fetch("/api/gemini", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: text
                    })
                });

                const data = await response.json();

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    data.response ||
                    "Gemini error: " +
                    (data.error || "Unknown error");

            } catch (error) {

                console.error("Gemini error:", error);

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    "Could not connect to Gemini.";
            }

            return;
        }


        // OTHER AI DEMO
        addMessage(
            "ai",
            aiResponses[selectedAI] ||
            `${selectedAI} is currently in demo mode.`
        );

        return;
    }


    // -------------------------
    // AI COUNCIL MODE
    // -------------------------

    if (mode === "council") {

        console.log(
            "Council members:",
            selectedAIs
        );

        for (const ai of selectedAIs) {

            // CHATGPT
            if (ai === "ChatGPT") {

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

                    thinkingMessage.querySelector(
                        ".message-content"
                    ).textContent =
                        "ChatGPT: " +
                        (
                            data.response ||
                            data.error ||
                            "No response."
                        );

                } catch (error) {

                    console.error("ChatGPT error:", error);

                    thinkingMessage.querySelector(
                        ".message-content"
                    ).textContent =
                        "ChatGPT: Connection error.";
                }

            }


            // GEMINI
            else if (ai === "Gemini") {

                const thinkingMessage = addMessage(
                    "ai",
                    "Gemini is thinking..."
                );

                try {

                    const response = await fetch("/api/gemini", {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            message: text
                        })
                    });

                    const data = await response.json();

                    thinkingMessage.querySelector(
                        ".message-content"
                    ).textContent =
                        "Gemini: " +
                        (
                            data.response ||
                            data.error ||
                            "No response."
                        );

                } catch (error) {

                    console.error("Gemini error:", error);

                    thinkingMessage.querySelector(
                        ".message-content"
                    ).textContent =
                        "Gemini: Connection error.";
                }

            }


            // OTHER AI
            else {

                await new Promise(resolve =>
                    setTimeout(resolve, 500)
                );

                addMessage(
                    "ai",
                    `${ai}: I'm currently in demo mode.`
                );
            }
        }
    }
}


// -----------------------------
// STARTUP
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("messageInput");

    if (input) {
        input.addEventListener(
            "keydown",
            handleKey
        );
    }

});

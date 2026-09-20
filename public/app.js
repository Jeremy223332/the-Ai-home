
let selectedAIs = ["ChatGPT"];
let mode = "one";

// =============================
// MESSAGE DISPLAY
// =============================

function addMessage(type, text) {
    const messages = document.getElementById("messages");

    if (!messages) {
        console.error("messages container not found.");
        return null;
    }

    const message = document.createElement("div");
    message.className = "message " + type;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = type === "user" ? "U" : "AI";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    message.appendChild(avatar);
    message.appendChild(content);

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
}


// =============================
// SEND MESSAGE
// =============================

async function sendMessage() {
    const input = document.getElementById("messageInput");

    if (!input) {
        console.error("messageInput was not found.");
        return;
    }

    const text = input.value.trim();

    if (!text) {
        return;
    }

    addMessage("user", text);
    input.value = "";

    if (selectedAIs.length === 0) {
        addMessage("system", "Please select an AI first.");
        return;
    }

    // =============================
    // CHATGPT
    // =============================

    if (selectedAIs.includes("ChatGPT")) {
        const message = addMessage(
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

            message.querySelector(
                ".message-content"
            ).textContent =
                data.response ||
                data.error ||
                "ChatGPT returned no response.";

        } catch (error) {
            console.error("ChatGPT error:", error);

            message.querySelector(
                ".message-content"
            ).textContent =
                "Could not connect to ChatGPT.";
        }

        return;
    }


    // =============================
    // GEMINI
    // =============================

    if (selectedAIs.includes("Gemini")) {
        const message = addMessage(
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

            message.querySelector(
                ".message-content"
            ).textContent =
                data.response ||
                data.error ||
                "Gemini returned no response.";

        } catch (error) {
            console.error("Gemini error:", error);

            message.querySelector(
                ".message-content"
            ).textContent =
                "Could not connect to Gemini.";
        }

        return;
    }


    // =============================
    // CLAUDE
    // =============================

    if (selectedAIs.includes("Claude")) {
        const message = addMessage(
            "ai",
            "Claude is thinking..."
        );

        try {
            const response = await fetch("/api/claude", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text
                })
            });

            const data = await response.json();

            message.querySelector(
                ".message-content"
            ).textContent =
                data.response ||
                data.error ||
                "Claude returned no response.";

        } catch (error) {
            console.error("Claude error:", error);

            message.querySelector(
                ".message-content"
            ).textContent =
                "Could not connect to Claude.";
        }

        return;
    }


    // =============================
    // V0
    // =============================

    if (selectedAIs.includes("v0")) {
        const message = addMessage(
            "ai",
            "v0 is thinking..."
        );

        try {
            const response = await fetch("/api/v0", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text
                })
            });

            const data = await response.json();

            message.querySelector(
                ".message-content"
            ).textContent =
                data.response ||
                data.error ||
                "v0 returned no response.";

        } catch (error) {
            console.error("v0 error:", error);

            message.querySelector(
                ".message-content"
            ).textContent =
                "Could not connect to v0.";
        }

        return;
    }
}


// =============================
// AI SELECTION
// =============================

function updateAISelection() {
    const checkboxes = document.querySelectorAll(
        ".ai-checkbox"
    );

    selectedAIs = [];

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedAIs.push(checkbox.value);
        }
    });

    console.log("Selected AIs:", selectedAIs);
}


// =============================
// ADD AI
// =============================

function addAI() {
    const aiList = document.getElementById("aiList");

    if (!aiList) {
        console.error("AI list not found.");
        return;
    }

    const existing = Array.from(
        document.querySelectorAll(".ai-checkbox")
    ).map(function (checkbox) {
        return checkbox.value;
    });

    const availableAIs = [
        "Gemini",
        "Claude",
        "v0"
    ];

    const nextAI = availableAIs.find(function (ai) {
        return !existing.includes(ai);
    });

    if (!nextAI) {
        alert("All available AIs are already added.");
        return;
    }

    const label = document.createElement("label");
    label.className = "ai-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "ai-checkbox";
    checkbox.value = nextAI;
    checkbox.checked = true;

    const dot = document.createElement("span");
    dot.className = "ai-dot " + nextAI.toLowerCase();

    label.appendChild(checkbox);
    label.appendChild(dot);
    label.appendChild(
        document.createTextNode(" " + nextAI)
    );

    aiList.appendChild(label);

    checkbox.addEventListener(
        "change",
        updateAISelection
    );

    updateAISelection();

    console.log("Added AI:", nextAI);
}


// =============================
// MODE
// =============================

function setMode(newMode) {
    mode = newMode;

    const singleMode =
        document.getElementById("singleMode");

    const councilMode =
        document.getElementById("councilMode");

    const modeText =
        document.getElementById("modeText");

    if (singleMode) {
        singleMode.classList.toggle(
            "active",
            newMode === "single"
        );
    }

    if (councilMode) {
        councilMode.classList.toggle(
            "active",
            newMode === "council"
        );
    }

    if (modeText) {
        modeText.textContent =
            newMode === "council"
                ? "Multiple AIs working together"
                : "Talking with one AI";
    }

    console.log("Mode changed:", newMode);
}


// =============================
// NEW CHAT
// =============================

function newChat() {
    const messages =
        document.getElementById("messages");

    if (messages) {
        messages.innerHTML = "";
    }

    addMessage(
        "system",
        "New chat started."
    );
}


// =============================
// EXAMPLE PROMPTS
// =============================

function examplePrompt(text) {
    const input =
        document.getElementById("messageInput");

    if (!input) {
        return;
    }

    input.value = text;
    input.focus();
}


// =============================
// ENTER KEY
// =============================

function handleKey(event) {
    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {
        event.preventDefault();
        sendMessage();
    }
}


// =============================
// STARTUP
// =============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "AI Council JavaScript loaded."
        );

        const input =
            document.getElementById(
                "messageInput"
            );

        if (input) {
            input.addEventListener(
                "keydown",
                handleKey
            );
        }

        const checkboxes =
            document.querySelectorAll(
                ".ai-checkbox"
            );

        checkboxes.forEach(
            function (checkbox) {
                checkbox.addEventListener(
                    "change",
                    updateAISelection
                );
            }
        );

        updateAISelection();
    }
);


// =============================
// MAKE HTML BUTTONS WORK
// =============================

window.addAI = addAI;
window.setMode = setMode;
window.newChat = newChat;
window.sendMessage = sendMessage;
window.examplePrompt = examplePrompt;
```

let selectedAIs = ["ChatGPT"];
let mode = "one";


// =============================
// MESSAGE DISPLAY
// =============================

function addMessage(type, text) {

    const messages =
        document.getElementById("messages");

    if (!messages) {
        console.error("messages container not found.");
        return null;
    }

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;

    const avatar =
        document.createElement("div");

    avatar.className = "avatar";

    avatar.textContent =
        type === "user" ? "U" : "AI";

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    content.textContent = text;

    message.appendChild(avatar);
    message.appendChild(content);

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;

    return message;
}


// =============================
// SEND MESSAGE
// =============================

async function sendMessage() {

    console.log("SEND BUTTON PRESSED");

    const input =
        document.getElementById("messageInput");

    if (!input) {
        console.error(
            "messageInput was not found."
        );
        return;
    }

    const text =
        input.value.trim();

    if (!text) {
        console.log("Message is empty.");
        return;
    }

    console.log(
        "Sending message:",
        text
    );

    // Show user's message
    addMessage(
        "user",
        text
    );

    // Clear textbox
    input.value = "";

    // Make sure an AI is selected
    if (selectedAIs.length === 0) {

        addMessage(
            "system",
            "Please select an AI first."
        );

        return;
    }

    // =============================
    // CHATGPT
    // =============================

    if (
        selectedAIs.includes("ChatGPT")
    ) {

        const message =
            addMessage(
                "ai",
                "ChatGPT is thinking..."
            );

        try {

            const response =
                await fetch(
                    "/api/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message: text
                            })
                    }
                );

            const data =
                await response.json();

            console.log(
                "ChatGPT response:",
                data
            );

            if (data.response) {

                message
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        data.response;

            } else {

                message
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        data.error ||
                        "ChatGPT returned no response.";
            }

        } catch (error) {

            console.error(
                "ChatGPT error:",
                error
            );

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    "Could not connect to ChatGPT.";
        }

        return;
    }


    // =============================
    // GEMINI
    // =============================

    if (
        selectedAIs.includes("Gemini")
    ) {

        const message =
            addMessage(
                "ai",
                "Gemini is thinking..."
            );

        try {

            const response =
                await fetch(
                    "/api/gemini",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message: text
                            })
                    }
                );

            const data =
                await response.json();

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    data.response ||
                    data.error ||
                    "Gemini returned no response.";

        } catch (error) {

            console.error(
                "Gemini error:",
                error
            );

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    "Could not connect to Gemini.";
        }

        return;
    }


    // =============================
    // CLAUDE
    // =============================

    if (
        selectedAIs.includes("Claude")
    ) {

        const message =
            addMessage(
                "ai",
                "Claude is thinking..."
            );

        try {

            const response =
                await fetch(
                    "/api/claude",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message: text
                            })
                    }
                );

            const data =
                await response.json();

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    data.response ||
                    data.error ||
                    "Claude returned no response.";

        } catch (error) {

            console.error(
                "Claude error:",
                error
            );

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    "Could not connect to Claude.";
        }

        return;
    }


    // =============================
    // V0
    // =============================

    if (
        selectedAIs.includes("v0")
    ) {

        const message =
            addMessage(
                "ai",
                "v0 is thinking..."
            );

        try {

            const response =
                await fetch(
                    "/api/v0",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message: text
                            })
                    }
                );

            const data =
                await response.json();

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    data.response ||
                    data.error ||
                    "v0 returned no response.";

        } catch (error) {

            console.error(
                "v0 error:",
                error
            );

            message
                .querySelector(
                    ".message-content"
                )
                .textContent =
                    "Could not connect to v0.";
        }

        return;
    }
}


// =============================
// AI SELECTION
// =============================

function updateAISelection() {

    const checkboxes =
        document.querySelectorAll(
            ".ai-checkbox"
        );

    selectedAIs = [];

    checkboxes.forEach(
        checkbox => {

            if (checkbox.checked) {

                selectedAIs.push(
                    checkbox.value
                );

            }
        }
    );

    console.log(
        "Selected AIs:",
        selectedAIs
    );
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
    () => {

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

        } else {

            console.error(
                "messageInput not found."
            );
        }


        const checkboxes =
            document.querySelectorAll(
                ".ai-checkbox"
            );

        checkboxes.forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    updateAISelection
                );

            }
        );

        updateAISelection();

    }
);

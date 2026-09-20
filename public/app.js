let selectedAIs = ["ChatGPT"];
let mode = "one";

const aiResponses = {
    ChatGPT: "Hello! I'm ChatGPT.",
    Gemini: "Hello! I'm Gemini.",
    Claude: "Hello! I'm Claude.",
    Copilot: "Hello! I'm Copilot.",
    Replit: "Hello! I'm Replit.",
    Framer: "Hello! I'm Framer.",
    Base44: "I'm currently in demo mode."
};


// -----------------------------
// AI SELECTION
// -----------------------------

function selectAI(ai) {

    // Find the official name regardless of capitalization
    const officialAI = getOfficialAIName(ai);

    if (!officialAI) {
        console.warn("Unknown AI:", ai);
        return;
    }

    // Toggle AI selection
    if (selectedAIs.includes(officialAI)) {
        selectedAIs = selectedAIs.filter(
            name => name !== officialAI
        );
    } else {
        selectedAIs.push(officialAI);
    }

    updateAISelection();

    console.log("Selected AIs:", selectedAIs);
}


// -----------------------------
// OFFICIAL AI NAME
// -----------------------------

function getOfficialAIName(name) {

    const aiNames = [
        "ChatGPT",
        "Gemini",
        "Claude",
        "Copilot",
        "Replit",
        "Framer",
        "Base44"
    ];

    const lowerName = name.trim().toLowerCase();

    return aiNames.find(
        ai => ai.toLowerCase() === lowerName
    ) || null;
}


// -----------------------------
// UPDATE AI BUTTONS
// -----------------------------

function updateAISelection() {

    document.querySelectorAll(".ai-option").forEach(option => {

        option.classList.remove("selected");

        const aiName = option.dataset.ai;

        if (!aiName) {
            return;
        }

        const officialName = getOfficialAIName(aiName);

        if (
            officialName &&
            selectedAIs.includes(officialName)
        ) {
            option.classList.add("selected");
        }
    });
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

        const buttonText =
            button.textContent.trim().toLowerCase();

        if (
            (newMode === "one" &&
                buttonText.includes("one ai")) ||

            (newMode === "council" &&
                buttonText.includes("ai council"))
        ) {
            button.classList.add("active");
        }
    });

    // In One AI mode, only keep the first selected AI
    if (mode === "one" && selectedAIs.length > 1) {

        selectedAIs = [
            selectedAIs[0]
        ];

        updateAISelection();
    }
}


// -----------------------------
// ADD AI
// -----------------------------

function addAI() {

    const aiNameInput =
        prompt(
            "Enter the AI name:\n\n" +
            "Examples: ChatGPT, Gemini, Claude, Copilot, Base44"
        );

    if (!aiNameInput) {
        return;
    }

    const officialAI =
        getOfficialAIName(aiNameInput);

    if (!officialAI) {

        alert(
            `"${aiNameInput}" isn't a supported AI yet.`
        );

        return;
    }

    if (selectedAIs.includes(officialAI)) {

        alert(
            `${officialAI} is already selected.`
        );

        return;
    }

    selectedAIs.push(officialAI);

    updateAISelection();

    console.log(
        "Added AI:",
        officialAI
    );
}


// -----------------------------
// ADD MESSAGE
// -----------------------------

function addMessage(type, text) {

    const chat =
        document.getElementById("chat");

    if (!chat) {

        console.error(
            "Chat element not found."
        );

        return null;
    }

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    content.textContent =
        text;

    message.appendChild(content);

    chat.appendChild(message);

    chat.scrollTop =
        chat.scrollHeight;

    return message;
}


// -----------------------------
// KEYBOARD
// -----------------------------

function handleKey(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }
}


// -----------------------------
// SEND MESSAGE
// -----------------------------

async function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );

    if (!input) {

        console.error(
            "messageInput not found."
        );

        return;
    }

    const text =
        input.value.trim();

    if (!text) {
        return;
    }

    if (selectedAIs.length === 0) {

        addMessage(
            "system",
            "Please select an AI first."
        );

        return;
    }

    addMessage(
        "user",
        text
    );

    input.value = "";


    // -------------------------
    // ONE AI MODE
    // -------------------------

    if (mode === "one") {

        const selectedAI =
            selectedAIs[0];

        console.log(
            "Sending to:",
            selectedAI
        );


        // CHATGPT
        if (selectedAI === "ChatGPT") {

            const thinkingMessage =
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

                            body: JSON.stringify({
                                message: text
                            })
                        }
                    );

                const data =
                    await response.json();

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    data.response ||
                    "ChatGPT error: " +
                    (
                        data.error ||
                        "Unknown error"
                    );

            } catch (error) {

                console.error(
                    "ChatGPT error:",
                    error
                );

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    "Could not connect to ChatGPT.";
            }

            return;
        }


        // GEMINI
        if (selectedAI === "Gemini") {

            const thinkingMessage =
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

                            body: JSON.stringify({
                                message: text
                            })
                        }
                    );

                const data =
                    await response.json();

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    data.response ||
                    "Gemini error: " +
                    (
                        data.error ||
                        "Unknown error"
                    );

            } catch (error) {

                console.error(
                    "Gemini error:",
                    error
                );

                thinkingMessage.querySelector(
                    ".message-content"
                ).textContent =
                    "Could not connect to Gemini.";
            }

            return;
        }


        // OTHER AI
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

        for (
            const ai of selectedAIs
        ) {


            // CHATGPT
            if (ai === "ChatGPT") {

                const thinkingMessage =
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

                                body: JSON.stringify({
                                    message: text
                                })
                            }
                        );

                    const data =
                        await response.json();

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

                    console.error(
                        "ChatGPT error:",
                        error
                    );

                    thinkingMessage.querySelector(
                        ".message-content"
                    ).textContent =
                        "ChatGPT: Connection error.";
                }

            }


            // GEMINI
            else if (ai === "Gemini") {

                const thinkingMessage =
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

                                body: JSON.stringify({
                                    message: text
                                })
                            }
                        );

                    const data =
                        await response.json();

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

                    console.error(
                        "Gemini error:",
                        error
                    );

                    thinkingMessage.querySelector(
                        ".message-content"
                    ).textContent =
                        "Gemini: Connection error.";
                }

            }


            // OTHER AI
            else {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            500
                        )
                );

                addMessage(
                    "ai",
                    `${ai}: ${
                        aiResponses[ai] ||
                        "I'm currently in demo mode."
                    }`
                );
            }
        }
    }
}


// -----------------------------
// STARTUP
// -----------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

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

        updateAISelection();
    }
);

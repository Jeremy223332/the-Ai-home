let selectedAIs = ["ChatGPT"];
let mode = "one";


// =============================
// AI RESPONSES
// =============================

const aiResponses = {

    ChatGPT:
        "Hello! I'm ChatGPT.",

    Gemini:
        "Hello! I'm Gemini.",

    Claude:
        "Hello! I'm Claude.",

    v0:
        "Hello! I'm v0. I can help build websites and apps.",

    Base44:
        "I'm currently in demo mode."

};


// =============================
// SUPPORTED AIs
// =============================

const aiNames = [
    "ChatGPT",
    "Gemini",
    "Claude",
    "v0",
    "Base44"
];


// =============================
// OFFICIAL AI NAME
// =============================

function getOfficialAIName(name) {

    if (!name) {
        return null;
    }

    const lowerName =
        name.trim().toLowerCase();

    return aiNames.find(
        ai =>
            ai.toLowerCase() === lowerName
    ) || null;
}


// =============================
// AI SELECTION
// =============================

function selectAI(ai) {

    const officialAI =
        getOfficialAIName(ai);

    if (!officialAI) {

        console.warn(
            "Unknown AI:",
            ai
        );

        return;
    }


    if (
        selectedAIs.includes(
            officialAI
        )
    ) {

        selectedAIs =
            selectedAIs.filter(
                name =>
                    name !== officialAI
            );

    } else {

        selectedAIs.push(
            officialAI
        );
    }


    updateAISelection();

    console.log(
        "Selected AIs:",
        selectedAIs
    );
}


// =============================
// UPDATE AI SELECTION
// =============================

function updateAISelection() {

    // Support both the old .ai-option
    // system and the current checkbox system.

    document
        .querySelectorAll(".ai-option")
        .forEach(option => {

            option.classList.remove(
                "selected"
            );

            const aiName =
                option.dataset.ai;

            if (!aiName) {
                return;
            }

            const officialName =
                getOfficialAIName(
                    aiName
                );

            if (
                officialName &&
                selectedAIs.includes(
                    officialName
                )
            ) {

                option.classList.add(
                    "selected"
                );
            }
        });


    // Current sidebar checkboxes

    document
        .querySelectorAll(
            "#aiList input[type='checkbox']"
        )
        .forEach(checkbox => {

            const aiName =
                getOfficialAIName(
                    checkbox.value
                );

            checkbox.checked =
                !!aiName &&
                selectedAIs.includes(
                    aiName
                );
        });


    updateSelectedInfo();
}


// =============================
// SELECTED AI INFO
// =============================

function updateSelectedInfo() {

    const info =
        document.getElementById(
            "selectedInfo"
        );

    if (!info) {
        return;
    }


    if (selectedAIs.length === 0) {

        info.textContent =
            "No AI selected";

        return;
    }


    if (mode === "one") {

        info.textContent =
            selectedAIs[0] +
            " selected";

        return;
    }


    info.textContent =
        selectedAIs.length +
        " AIs selected: " +
        selectedAIs.join(", ");
}


// =============================
// MODE SWITCHING
// =============================

function setMode(newMode) {

    mode = newMode;

    console.log(
        "Mode changed to:",
        mode
    );


    const singleButton =
        document.getElementById(
            "singleMode"
        );

    const councilButton =
        document.getElementById(
            "councilMode"
        );


    if (singleButton) {

        singleButton.classList.toggle(
            "active",
            newMode === "single" ||
            newMode === "one"
        );
    }


    if (councilButton) {

        councilButton.classList.toggle(
            "active",
            newMode === "council"
        );
    }


    // Support the older button class too.

    document
        .querySelectorAll(
            ".mode-button"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

            const buttonText =
                button.textContent
                    .trim()
                    .toLowerCase();

            if (
                (
                    newMode === "one" ||
                    newMode === "single"
                ) &&
                buttonText.includes(
                    "one ai"
                )
            ) {

                button.classList.add(
                    "active"
                );
            }


            if (
                newMode === "council" &&
                buttonText.includes(
                    "ai council"
                )
            ) {

                button.classList.add(
                    "active"
                );
            }
        });


    // Normalize "single" to "one"

    if (mode === "single") {
        mode = "one";
    }


    // One AI mode only allows one AI.

    if (
        mode === "one" &&
        selectedAIs.length > 1
    ) {

        selectedAIs = [
            selectedAIs[0]
        ];

        updateAISelection();
    }


    const modeText =
        document.getElementById(
            "modeText"
        );

    if (modeText) {

        modeText.textContent =
            mode === "council"
                ? "Multiple AIs are collaborating"
                : "Talking with one AI";
    }


    updateSelectedInfo();
}


// =============================
// ADD AI
// =============================

function addAI() {

    const aiNameInput =
        prompt(
            "Enter the AI name:\n\n" +
            "Examples: ChatGPT, Gemini, Claude, v0"
        );


    if (!aiNameInput) {
        return;
    }


    const officialAI =
        getOfficialAIName(
            aiNameInput
        );


    if (!officialAI) {

        alert(
            `"${aiNameInput}" isn't a supported AI yet.`
        );

        return;
    }


    if (
        selectedAIs.includes(
            officialAI
        )
    ) {

        alert(
            `${officialAI} is already selected.`
        );

        return;
    }


    selectedAIs.push(
        officialAI
    );


    updateAISelection();


    console.log(
        "Added AI:",
        officialAI
    );
}


// =============================
// ADD MESSAGE
// =============================

function addMessage(type, text) {

    const chat =
        document.getElementById(
            "chat"
        );


    if (!chat) {

        console.error(
            "Chat element not found."
        );

        return null;
    }


    const message =
        document.createElement(
            "div"
        );

    message.className =
        `message ${type}`;


    const content =
        document.createElement(
            "div"
        );

    content.className =
        "message-content";


    content.textContent =
        text;


    message.appendChild(
        content
    );


    chat.appendChild(
        message
    );


    chat.scrollTop =
        chat.scrollHeight;


    return message;
}


// =============================
// BUILDER MODE
// =============================

function isBuilderRequest(message) {

    const text =
        message.toLowerCase();


    const builderPhrases = [

        "let's build",
        "lets build",

        "build a website",
        "build me a website",

        "create a website",
        "create me a website",

        "make a website",
        "make me a website",

        "build an app",
        "build me an app",

        "create an app",
        "create me an app",

        "make an app",
        "make me an app",

        "build a discord bot",
        "build me a discord bot",

        "create a discord bot",
        "create me a discord bot",

        "make a discord bot",
        "make me a discord bot",

        "build a chrome extension",
        "build me a chrome extension",

        "create a chrome extension",

        "build an api",
        "build me an api",

        "create an api"
    ];


    return builderPhrases.some(
        phrase =>
            text.includes(phrase)
    );
}


// =============================
// BUILDER PROJECT TYPE
// =============================

function getBuilderProjectType(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("discord bot") ||
        text.includes("discord bot")
    ) {

        return "Discord Bot";
    }


    if (
        text.includes("chrome extension") ||
        text.includes("browser extension")
    ) {

        return "Chrome Extension";
    }


    if (
        text.includes("api")
    ) {

        return "API";
    }


    if (
        text.includes("discord")
    ) {

        return "Discord Project";
    }


    if (
        text.includes("app")
    ) {

        return "Web App";
    }


    return "Website";
}


// =============================
// OPEN BUILDER
// =============================

function openBuilder(message) {

    const panel =
        document.getElementById(
            "builderPanel"
        );


    if (!panel) {

        console.error(
            "Builder panel not found."
        );

        return;
    }


    const projectName =
        document.getElementById(
            "builderProjectName"
        );


    const projectType =
        document.getElementById(
            "builderProjectType"
        );


    const type =
        getBuilderProjectType(
            message
        );


    if (projectName) {

        projectName.textContent =
            "New " +
            type +
            " Project";
    }


    if (projectType) {

        projectType.textContent =
            type;
    }


    panel.classList.remove(
        "hidden"
    );


    // Reset the agents.

    updateBuilderAgent(
        "agentChatGPT",
        "Planning..."
    );

    updateBuilderAgent(
        "agentGemini",
        "Waiting..."
    );

    updateBuilderAgent(
        "agentClaude",
        "Waiting..."
    );

    updateBuilderAgent(
        "agentV0",
        "Waiting..."
    );


    clearBuilderLog();


    addBuilderLog(
        "AI Council started a new " +
        type +
        " project."
    );


    addBuilderLog(
        "ChatGPT is planning the project..."
    );
}


// =============================
// CLOSE BUILDER
// =============================

function closeBuilder() {

    const panel =
        document.getElementById(
            "builderPanel"
        );


    if (panel) {

        panel.classList.add(
            "hidden"
        );
    }
}


// =============================
// BUILDER LOG
// =============================

function addBuilderLog(message) {

    const log =
        document.getElementById(
            "builderLog"
        );


    if (!log) {
        return;
    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "builder-log-item";


    item.textContent =
        message;


    log.appendChild(
        item
    );


    log.scrollTop =
        log.scrollHeight;
}


// =============================
// CLEAR BUILDER LOG
// =============================

function clearBuilderLog() {

    const log =
        document.getElementById(
            "builderLog"
        );


    if (!log) {
        return;
    }


    log.innerHTML = "";
}


// =============================
// BUILDER AI STATUS
// =============================

function updateBuilderAgent(
    agent,
    status
) {

    const element =
        document.getElementById(
            agent
        );


    if (!element) {
        return;
    }


    const statusElement =
        element.querySelector(
            "span"
        );


    if (statusElement) {

        statusElement.textContent =
            status;
    }
}


// =============================
// KEYBOARD
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
// CHATGPT REQUEST
// =============================

async function askChatGPT(message) {

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
                    message
                })
            }
        );


    return await response.json();
}


// =============================
// GEMINI REQUEST
// =============================

async function askGemini(message) {

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
                    message
                })
            }
        );


    return await response.json();
}


// =============================
// V0 REQUEST
// =============================

async function askV0(message) {

    const response =
        await fetch(
            "/api/v0",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message
                })
            }
        );


    return await response.json();
}


// =============================
// SEND MESSAGE
// =============================

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


    if (
        selectedAIs.length === 0
    ) {

        addMessage(
            "system",
            "Please select an AI first."
        );

        return;
    }


    // Show user's message.

    addMessage(
        "user",
        text
    );


    input.value = "";


    // =========================
    // BUILDER DETECTION
    // =========================

    if (
        isBuilderRequest(text)
    ) {

        openBuilder(text);

        return;
    }


    // =========================
    // ONE AI MODE
    // =========================

    if (mode === "one") {

        const selectedAI =
            selectedAIs[0];


        console.log(
            "Sending to:",
            selectedAI
        );


        // =====================
        // CHATGPT
        // =====================

        if (
            selectedAI === "ChatGPT"
        ) {

            const thinkingMessage =
                addMessage(
                    "ai",
                    "ChatGPT is thinking..."
                );


            try {

                const data =
                    await askChatGPT(
                        text
                    );


                thinkingMessage
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
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


                thinkingMessage
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        "Could not connect to ChatGPT.";
            }


            return;
        }


        // =====================
        // GEMINI
        // =====================

        if (
            selectedAI === "Gemini"
        ) {

            const thinkingMessage =
                addMessage(
                    "ai",
                    "Gemini is thinking..."
                );


            try {

                const data =
                    await askGemini(
                        text
                    );


                thinkingMessage
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
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


                thinkingMessage
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        "Could not connect to Gemini.";
            }


            return;
        }


        // =====================
        // CLAUDE
        // =====================

        if (
            selectedAI === "Claude"
        ) {

            addMessage(
                "ai",
                aiResponses.Claude
            );

            return;
        }


        // =====================
        // V0
        // =====================

        if (
            selectedAI === "v0"
        ) {

            const thinkingMessage =
                addMessage(
                    "ai",
                    "v0 is building..."
                );


            try {

                const data =
                    await askV0(
                        text
                    );


                thinkingMessage
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        data.response ||
                        "v0 error: " +
                        (
                            data.error ||
                            "Unknown error"
                        );


            } catch (error) {

                console.error(
                    "v0 error:",
                    error
                );


                thinkingMessage
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        "Could not connect to v0.";
            }


            return;
        }


        // =====================
        // OTHER AI
        // =====================

        addMessage(
            "ai",
            aiResponses[selectedAI] ||
            `${selectedAI} is currently in demo mode.`
        );


        return;
    }


    // =========================
    // AI COUNCIL MODE
    // =========================

    if (
        mode === "council"
    ) {

        console.log(
            "Council members:",
            selectedAIs
        );


        for (
            const ai of selectedAIs
        ) {


            // =====================
            // CHATGPT
            // =====================

            if (
                ai === "ChatGPT"
            ) {

                const thinkingMessage =
                    addMessage(
                        "ai",
                        "ChatGPT is thinking..."
                    );


                try {

                    const data =
                        await askChatGPT(
                            text
                        );


                    thinkingMessage
                        .querySelector(
                            ".message-content"
                        )
                        .textContent =
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


                    thinkingMessage
                        .querySelector(
                            ".message-content"
                        )
                        .textContent =
                            "ChatGPT: Connection error.";
                }
            }


            // =====================
            // GEMINI
            // =====================

            else if (
                ai === "Gemini"
            ) {

                const thinkingMessage =
                    addMessage(
                        "ai",
                        "Gemini is thinking..."
                    );


                try {

                    const data =
                        await askGemini(
                            text
                        );


                    thinkingMessage
                        .querySelector(
                            ".message-content"
                        )
                        .textContent =
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


                    thinkingMessage
                        .querySelector(
                            ".message-content"
                        )
                        .textContent =
                            "Gemini: Connection error.";
                }
            }


            // =====================
            // V0
            // =====================

            else if (
                ai === "v0"
            ) {

                const thinkingMessage =
                    addMessage(
                        "ai",
                        "v0 is building..."
                    );


                try {

                    const data =
                        await askV0(
                            text
                        );


                    thinkingMessage
                        .querySelector(
                            ".message-content"
                        )
                        .textContent =
                            "v0: " +
                            (
                                data.response ||
                                data.error ||
                                "No response."
                            );


                } catch (error) {

                    console.error(
                        "v0 error:",
                        error
                    );


                    thinkingMessage
                        .querySelector(
                            ".message-content"
                        )
                        .textContent =
                            "v0: Connection error.";
                }
            }


            // =====================
            // OTHER AI
            // =====================

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


// =============================
// NEW CHAT
// =============================

function newChat() {

    const chat =
        document.getElementById(
            "chat"
        );


    if (chat) {

        chat.innerHTML = "";
    }


    const title =
        document.getElementById(
            "conversationTitle"
        );


    if (title) {

        title.textContent =
            "New Conversation";
    }


    const builderPanel =
        document.getElementById(
            "builderPanel"
        );


    if (builderPanel) {

        builderPanel.classList.add(
            "hidden"
        );
    }


    console.log(
        "Started new conversation."
    );
}


// =============================
// EXAMPLE PROMPTS
// =============================

function examplePrompt(text) {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) {
        return;
    }


    input.value =
        text;


    input.focus();
}


// =============================
// STARTUP
// =============================

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


        // Sidebar checkbox handling

        document
            .querySelectorAll(
                "#aiList input[type='checkbox']"
            )
            .forEach(checkbox => {

                checkbox.addEventListener(
                    "change",
                    () => {

                        const ai =
                            getOfficialAIName(
                                checkbox.value
                            );


                        if (!ai) {
                            return;
                        }


                        if (
                            checkbox.checked
                        ) {

                            if (
                                !selectedAIs
                                    .includes(ai)
                            ) {

                                if (
                                    mode === "one"
                                ) {

                                    selectedAIs = [
                                        ai
                                    ];

                                } else {

                                    selectedAIs.push(
                                        ai
                                    );
                                }
                            }

                        } else {

                            selectedAIs =
                                selectedAIs.filter(
                                    name =>
                                        name !== ai
                                );
                        }


                        updateAISelection();

                    }
                );
            });


        // Builder close button

        const closeBuilderButton =
            document.getElementById(
                "closeBuilder"
            );


        if (
            closeBuilderButton
        ) {

            closeBuilderButton.addEventListener(
                "click",
                closeBuilder
            );
        }


        updateAISelection();

        setMode("one");
    }
);

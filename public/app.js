let selectedAIs = ["ChatGPT"];
let mode = "one";


// =============================
// AI RESPONSES
// =============================

const aiResponses = {

    ChatGPT: "Hello! I'm ChatGPT.",

    Gemini: "Hello! I'm Gemini.",

    Claude: "Hello! I'm Claude.",

    v0: "Hello! I'm v0. I can help build websites and apps.",

    Base44: "I'm currently in demo mode."

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
// UPDATE AI SELECTION
// =============================

function updateAISelection() {

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

    if (newMode === "single") {
        newMode = "one";
    }

    mode = newMode;


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
            mode === "one"
        );
    }


    if (councilButton) {

        councilButton.classList.toggle(
            "active",
            mode === "council"
        );
    }


    if (
        mode === "one" &&
        selectedAIs.length > 1
    ) {

        selectedAIs = [
            selectedAIs[0]
        ];
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


    updateAISelection();
}


// =============================
// ADD AI
// =============================

function addAI() {

    alert(
        "More AI providers will be added here later."
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
        return null;
    }


    const message =
        document.createElement(
            "div"
        );

    message.className =
        `message ${type}`;


    const avatar =
        document.createElement(
            "div"
        );

    avatar.className =
        "message-avatar";

    avatar.textContent =
        type === "user"
            ? "👤"
            : "🤖";


    const content =
        document.createElement(
            "div"
        );

    content.className =
        "message-content";


    content.textContent =
        text;


    message.appendChild(
        avatar
    );

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
// BUILDER DETECTION
// =============================

function isBuilderRequest(message) {

    const text =
        message
            .toLowerCase()
            .trim();


    const builderPhrases = [

        "let's build",
        "lets build",

        "build a website",
        "build me a website",
        "build website",

        "create a website",
        "create me a website",
        "create website",

        "make a website",
        "make me a website",
        "make website",

        "build an app",
        "build me an app",
        "build app",

        "create an app",
        "create me an app",
        "create app",

        "make an app",
        "make me an app",
        "make app",

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

    console.log(
        "BUILDER DETECTED:",
        message
    );


    const panel =
        document.getElementById(
            "builderPanel"
        );


    if (!panel) {

        console.error(
            "ERROR: builderPanel was not found."
        );

        alert(
            "Builder panel could not be found. Make sure index.html was updated."
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


    const builderStatus =
        document.getElementById(
            "builderStatus"
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


    if (builderStatus) {

        builderStatus.textContent =
            "The AIs are building...";
    }


    panel.classList.remove(
        "hidden"
    );


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
        "🚀 AI Council started a new " +
        type +
        " project."
    );


    addBuilderLog(
        "🧠 ChatGPT is planning the project..."
    );


    console.log(
        "Builder panel opened."
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


    addMessage(
        "user",
        text
    );


    input.value = "";


    // =========================
    // BUILDER MODE
    // =========================

    if (
        isBuilderRequest(text)
    ) {

        console.log(
            "Opening Builder Mode..."
        );


        openBuilder(text);

        return;
    }


    // =========================
    // ONE AI MODE
    // =========================

    if (mode === "one") {

        const selectedAI =
            selectedAIs[0];


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
                        data.error ||
                        "ChatGPT returned no response.";

            } catch (error) {

                console.error(
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
                        data.error ||
                        "Gemini returned no response.";

            } catch (error) {

                console.error(
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


        if (
            selectedAI === "Claude"
        ) {

            addMessage(
                "ai",
                aiResponses.Claude
            );

            return;
        }


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
                        data.error ||
                        "v0 returned no response.";

            } catch (error) {

                console.error(
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


        addMessage(
            "ai",
            aiResponses[selectedAI] ||
            `${selectedAI} is currently in demo mode.`
        );

        return;
    }


    // =========================
    // COUNCIL MODE
    // =========================

    for (
        const ai of selectedAIs
    ) {

        if (
            ai === "ChatGPT"
        ) {

            const message =
                addMessage(
                    "ai",
                    "ChatGPT is thinking..."
                );


            try {

                const data =
                    await askChatGPT(
                        text
                    );


                message
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

                message
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        "ChatGPT: Connection error.";
            }
        }


        else if (
            ai === "Gemini"
        ) {

            const message =
                addMessage(
                    "ai",
                    "Gemini is thinking..."
                );


            try {

                const data =
                    await askGemini(
                        text
                    );


                message
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

                message
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        "Gemini: Connection error.";
            }
        }


        else if (
            ai === "v0"
        ) {

            const message =
                addMessage(
                    "ai",
                    "v0 is building..."
                );


            try {

                const data =
                    await askV0(
                        text
                    );


                message
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

                message
                    .querySelector(
                        ".message-content"
                    )
                    .textContent =
                        "v0: Connection error.";
            }
        }


        else {

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


    closeBuilder();
}


// =============================
// EXAMPLE PROMPT
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
// STARTUP
// =============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "AI Council loaded."
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
                                mode === "one"
                            ) {

                                selectedAIs = [
                                    ai
                                ];

                            } else {

                                if (
                                    !selectedAIs.includes(
                                        ai
                                    )
                                ) {

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

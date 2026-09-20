```javascript
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
// GET OFFICIAL AI NAME
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

            const ai =
                getOfficialAIName(
                    checkbox.value
                );

            checkbox.checked =
                !!ai &&
                selectedAIs.includes(ai);

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
// MODE
// =============================

function setMode(newMode) {

    if (newMode === "single") {
        newMode = "one";
    }


    mode = newMode;


    const singleMode =
        document.getElementById(
            "singleMode"
        );

    const councilMode =
        document.getElementById(
            "councilMode"
        );


    if (singleMode) {

        singleMode.classList.toggle(
            "active",
            mode === "one"
        );
    }


    if (councilMode) {

        councilMode.classList.toggle(
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

        console.error(
            "Chat area not found."
        );

        return null;
    }


    const message =
        document.createElement(
            "div"
        );

    message.className =
        "message " + type;


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

    const panel =
        document.getElementById(
            "builderPanel"
        );


    if (!panel) {

        console.error(
            "builderPanel was not found."
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


    const status =
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


    if (status) {

        status.textContent =
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
```

let currentMode = "single";

function getSelectedAIs() {
    const boxes = document.querySelectorAll(
        '#aiList input[type="checkbox"]:checked'
    );

    return Array.from(boxes).map(box => box.value);
}


function updateSelectedInfo() {

    const selected = getSelectedAIs();

    const info = document.getElementById("selectedInfo");

    if (currentMode === "single") {

        if (selected.length === 0) {
            info.textContent = "No AI selected";
        } else {
            info.textContent = selected[0] + " selected";
        }

    } else {

        if (selected.length === 0) {
            info.textContent = "No AIs selected";
        } else {
            info.textContent =
                selected.length + " AIs in the council: " +
                selected.join(", ");
        }
    }
}


function setMode(mode) {

    currentMode = mode;

    const singleButton = document.getElementById("singleMode");
    const councilButton = document.getElementById("councilMode");

    const modeText = document.getElementById("modeText");

    if (mode === "single") {

        singleButton.classList.add("active");
        councilButton.classList.remove("active");

        modeText.textContent = "Talking with one AI";

        document.querySelectorAll(
            '#aiList input[type="checkbox"]'
        ).forEach((box, index) => {

            box.disabled = index !== 0;

        });

    } else {

        singleButton.classList.remove("active");
        councilButton.classList.add("active");

        modeText.textContent =
            "Multiple AIs can collaborate and debate";

        document.querySelectorAll(
            '#aiList input[type="checkbox"]'
        ).forEach(box => {

            box.disabled = false;

        });
    }

    updateSelectedInfo();
}


function addAI() {

    const name = prompt(
        "What AI would you like to add?\n\nExample: Perplexity"
    );

    if (!name || !name.trim()) {
        return;
    }

    const aiList = document.getElementById("aiList");

    const label = document.createElement("label");

    label.className = "ai-item";

    label.innerHTML = `
        <input type="checkbox" value="${name}">
        <span class="ai-dot" style="background:#888"></span>
        ${name}
    `;

    aiList.appendChild(label);

    updateSelectedInfo();
}


function newChat() {

    const chat = document.getElementById("chat");

    chat.innerHTML = `
        <div class="welcome">

            <div class="welcome-icon">🤖</div>

            <h2>New Conversation</h2>

            <p>
                Select an AI and start talking.
            </p>

        </div>
    `;

    document.getElementById(
        "conversationTitle"
    ).textContent = "New Conversation";
}


function examplePrompt(text) {

    document.getElementById(
        "messageInput"
    ).value = text;

    sendMessage();
}


function addMessage(name, text, user = false) {

    const chat = document.getElementById("chat");

    const message = document.createElement("div");

    message.className = "message";

    message.innerHTML = `
        <div class="message-avatar">
            ${user ? "👤" : "🤖"}
        </div>

        <div>
            <div class="message-name">
                ${name}
            </div>

            <div class="message-content">
                ${text}
            </div>
        </div>
    `;

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


async function sendMessage() {

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if (!text) {
        return;
    }

    const selected = getSelectedAIs();

    if (selected.length === 0) {

        alert("Please select an AI first.");

        return;
    }

    if (currentMode === "single" && selected.length > 1) {

        alert("One AI mode only allows one AI.");

        return;
    }

    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }

    addMessage("You", text, true);

    input.value = "";

    document.getElementById(
        "conversationTitle"
    ).textContent = text.substring(0, 35);


    if (currentMode === "single") {

        const ai = selected[0];

        setTimeout(() => {

            addMessage(
                ai,
                getDemoResponse(ai, text)
            );

        }, 700);

    } else {

        for (const ai of selected) {

            await wait(800);

            addMessage(
                ai,
                getDemoResponse(ai, text)
            );
        }

    }
}


function getDemoResponse(ai, text) {

    const responses = {

        "ChatGPT":
            `I received your request: "${text}". Once my API is connected, I'll be able to give you a real response.`,

        "Gemini":
            `Gemini is ready to participate. I'm currently running in demo mode until the Gemini API is connected.`,

        "Claude":
            `Claude has joined the conversation. The real Claude response will appear here once the API is connected.`,

        "Copilot":
            `Copilot is standing by. Real API integration will allow me to work on your request.`,

        "Replit":
            `Replit can eventually help with coding and project development. I'm currently in demo mode.`,

        "Framer":
            `Framer can eventually help design and build websites. I'm currently in demo mode.`

    };

    return responses[ai] ||
        `${ai} is ready to participate once its API is connected.`;
}


function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });
}


function handleKey(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
}


document.addEventListener("change", event => {

    if (
        event.target.matches(
            '#aiList input[type="checkbox"]'
        )
    ) {

        if (currentMode === "single") {

            const boxes = document.querySelectorAll(
                '#aiList input[type="checkbox"]'
            );

            boxes.forEach(box => {

                if (box !== event.target) {
                    box.checked = false;
                }

            });
        }

        updateSelectedInfo();
    }

});


setMode("single");

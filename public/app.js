let selectedAIs = ["ChatGPT"];
let mode = "one";

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text) return;

    if (selectedAIs.length === 0) {
        addMessage("system", "Please select an AI first.");
        return;
    }

    addMessage("user", text);
    input.value = "";

    const selectedAI = selectedAIs[0];

    if (mode === "one" && selectedAI === "ChatGPT") {
        addMessage("ai", "ChatGPT is thinking...");

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

            const messages = document.querySelectorAll(".message");
            const lastMessage = messages[messages.length - 1];

            if (data.response) {
                lastMessage.querySelector(".message-content").textContent =
                    data.response;
            } else {
                lastMessage.querySelector(".message-content").textContent =
                    "Error: " + (data.error || "Unknown error");
            }

        } catch (error) {
            console.error(error);

            const messages = document.querySelectorAll(".message");
            const lastMessage = messages[messages.length - 1];

            lastMessage.querySelector(".message-content").textContent =
                "Could not connect to the AI server.";
        }

        return;
    }

    addMessage(
        "ai",
        `${selectedAI} is currently using demo mode.`
    );
}

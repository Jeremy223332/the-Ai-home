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

        if (ai === "ChatGPT") {

            addMessage(
                "ChatGPT",
                "Thinking..."
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

                const messages =
                    document.querySelectorAll(".message-content");

                const lastMessage =
                    messages[messages.length - 1];

                if (data.response) {

                    lastMessage.textContent =
                        data.response;

                } else {

                    lastMessage.textContent =
                        "Error: " + data.error;
                }

            } catch (error) {

                console.error(error);

                const messages =
                    document.querySelectorAll(".message-content");

                const lastMessage =
                    messages[messages.length - 1];

                lastMessage.textContent =
                    "Could not connect to the AI Council server.";
            }

        } else {

            setTimeout(() => {

                addMessage(
                    ai,
                    getDemoResponse(ai, text)
                );

            }, 700);

        }

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

const express = require("express");
const OpenAI = require("openai");
const { GoogleGenAI } = require("@google/genai");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));


// =============================
// OPENAI
// =============================

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// =============================
// GEMINI
// =============================

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =============================
// CLAUDE
// =============================

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// =============================
// COPILOT / MICROSOFT
// =============================

app.post("/api/copilot", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        if (!process.env.MICROSOFT_API_KEY) {
            return res.status(500).json({
                error: "MICROSOFT_API_KEY is missing from Render."
            });
        }

        if (!process.env.MICROSOFT_ENDPOINT) {
            return res.status(500).json({
                error: "MICROSOFT_ENDPOINT is missing from Render."
            });
        }

        if (!process.env.MICROSOFT_MODEL) {
            return res.status(500).json({
                error: "MICROSOFT_MODEL is missing from Render."
            });
        }

        const endpoint =
            process.env.MICROSOFT_ENDPOINT.replace(/\/+$/, "");

        const response = await fetch(
            `${endpoint}/openai/v1/chat/completions`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.MICROSOFT_API_KEY
                },

                body: JSON.stringify({
                    model: process.env.MICROSOFT_MODEL,

                    messages: [
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Microsoft error:",
                data
            );

            return res.status(response.status).json({
                error: "Copilot could not respond.",
                details: data
            });
        }

        const text =
            data.choices?.[0]?.message?.content;

        res.json({
            ai: "Copilot",
            response:
                text || "Copilot returned no response."
        });

    } catch (error) {

        console.error(
            "Copilot error:",
            error
        );

        res.status(500).json({
            error: "Copilot could not respond.",
            details:
                error.message ||
                String(error)
        });
    }

});

// =============================
// STATUS
// =============================

app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        message: "AI Council server is running"
    });

});


// =============================
// CHATGPT
// =============================

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({
                error: "Message is required."
            });

        }

        if (!process.env.OPENAI_API_KEY) {

            return res.status(500).json({
                error: "OPENAI_API_KEY is missing from Render."
            });

        }

        const response =
            await openai.responses.create({

                model: "gpt-5.6-luna",

                input: message

            });

        res.json({

            ai: "ChatGPT",

            response:
                response.output_text

        });

    } catch (error) {

        console.error(
            "OpenAI error:",
            error
        );

        res.status(500).json({

            error:
                "ChatGPT could not respond.",

            details:
                error.message ||
                String(error)

        });

    }

});


// =============================
// GEMINI
// =============================

app.post("/api/gemini", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is missing from Render."
            });
        }

        let response;

        // Try Gemini up to 3 times
        for (let attempt = 1; attempt <= 3; attempt++) {

            try {

                response =
                    await gemini.models.generateContent({
                        model: "gemini-3.8-flash",
                        contents: message
                    });

                break;

            } catch (error) {

                console.error(
                    `Gemini attempt ${attempt} failed:`,
                    error.message
                );

                // If this is the last attempt, throw the error
                if (attempt === 3) {
                    throw error;
                }

                // Wait 2 seconds before retrying
                await new Promise(resolve =>
                    setTimeout(resolve, 2000)
                );
            }
        }

        res.json({
            ai: "Gemini",
            response: response.text
        });

    } catch (error) {

        console.error(
            "========== GEMINI ERROR =========="
        );

        console.error(error);

        console.error(
            "==================================="
        );

        res.status(500).json({
            error: "Gemini could not respond.",
            details: error.message || String(error)
        });

    }

});

// =============================
// CLAUDE
// =============================

app.post("/api/claude", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({
                error: "Message is required."
            });

        }

        if (!process.env.ANTHROPIC_API_KEY) {

            return res.status(500).json({

                error:
                    "ANTHROPIC_API_KEY is missing from Render."

            });

        }

        const response =
            await anthropic.messages.create({

                model: "claude-sonnet-5",

                max_tokens: 1024,

                messages: [

                    {
                        role: "user",

                        content: message
                    }

                ]

            });

        const text =
            response.content
                .filter(
                    block =>
                        block.type === "text"
                )
                .map(
                    block =>
                        block.text
                )
                .join("");

        res.json({

            ai: "Claude",

            response: text

        });

    } catch (error) {

        console.error(
            "========== CLAUDE ERROR =========="
        );

        console.error(error);

        console.error(
            "==================================="
        );

        res.status(500).json({

            error:
                "Claude could not respond.",

            details:
                error.message ||
                String(error)

        });

    }

});


// =============================
// START SERVER
// =============================

app.listen(PORT, () => {

    console.log(
        `AI Council running on port ${PORT}`
    );

});

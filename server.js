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

                error:
                    "GEMINI_API_KEY is missing from Render."

            });

        }

        const response =
            await gemini.models.generateContent({

                model: "gemini-3.8-flash",

                contents: message

            });

        res.json({

            ai: "Gemini",

            response:
                response.text

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

            error:
                "Gemini could not respond.",

            details:
                error.message ||
                String(error)

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

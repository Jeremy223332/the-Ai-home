const express = require("express");
const OpenAI = require("openai");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Gemini
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Server status
app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        message: "AI Council server is running"
    });
});


// ChatGPT
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const response = await openai.responses.create({
            model: "gpt-5.6-luna",
            input: message
        });

        res.json({
            ai: "ChatGPT",
            response: response.output_text
        });

    } catch (error) {
        console.error("OpenAI error:", error);

        res.status(500).json({
            error: "ChatGPT could not respond.",
            details: error.message
        });
    }
});


// Gemini
app.post("/api/gemini", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const response = await gemini.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message
        });

        res.json({
            ai: "Gemini",
            response: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: "Gemini could not respond.",
            details: error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(
        `AI Council running on port ${PORT}`
    );
});

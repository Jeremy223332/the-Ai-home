const express = require("express");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        message: "AI Council server is running"
    });
});

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
            error: "The AI could not respond.",
            details: error.message
        });
    }

});

app.listen(PORT, () => {

    console.log(
        `AI Council running on port ${PORT}`
    );

});

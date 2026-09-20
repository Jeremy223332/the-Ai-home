const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));

app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        message: "AI Council server is running"
    });

});

app.listen(PORT, () => {

    console.log(
        `AI Council running on port ${PORT}`
    );

});

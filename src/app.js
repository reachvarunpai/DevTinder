const express = require("express");

const app = express();

app.use((req, res) => {
    res.send("Hello from the Server!");
});

app.use("/test", (req, res) => {
    res.send("Hello !");
});

app.use("/hello", (req, res) => {
    res.send("Hello ABD!");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on Port 7777....");
});
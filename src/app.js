const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({firstNmae: "Varun", lastName: "Pai"});
});

app.listen(7777, () => {
    console.log("Server is successfully listening on Port 7777....");
});
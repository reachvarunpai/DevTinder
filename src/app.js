const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({firstNmae: "Varun", lastName: "Pai"});
});

app.post("/user", (req, res) => {
    res.send("Data Successfully saved to Database.");
});

app.delete("/user", (req, res) => {
    res.send("Deleted Successfully...");
});

app.use("/test", (req, res) => {
    res.send("Hello !");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on Port 7777....");
});
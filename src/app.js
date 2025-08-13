const express = require("express");

const app = express();

app.use("/", (err, req, res, next) => {
if (err) {
    res.status(500).send("something went wrong");
}
});

app.get("/getUserData", (req, res) => {
    throw new Error("dvbzhjf");
    res.send("User Data sent");
});

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("something wrong");
    }
});

app.listen(7777, () => {
    console.log("Server is successfully listening on Port 7777....");
});
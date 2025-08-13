const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Varun",
        lastName: "Pai",
        emailId: "reachpai@gmail.com",
        password: "varun@123"
    });
    await user.save();
    res.send("User added successfully");
});

connectDB()
    .then(() => {
        console.log("Database connection established..");
        app.listen(7777, () => {
    console.log("Server is successfully listening on Port 7777....");
});
    })
    .catch((err) => {
        console.error("Database cannot be connected..");
    });

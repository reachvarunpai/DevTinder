const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const user = require("./models/user");
const { ReturnDocument } = require("mongodb");

app.use(express.json());

app.post("/signup", async (req, res) => {
   const user = new User(req.body);
   try {
    await user.save();
    res.send("User added successfully");
   } catch (err) {
    res.status(400).send("Error saving the user" + err.message);    
   }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        res.send(user);
        // const users = await User.find({ emailId: userEmail });
        // if(users.length === 0) {
        //     res.status(404).send("User not found");
        // } else {
        // res.send(users);
        // }
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
});

app.get("/feed", async (req, res) => {
try {
        const users = await User.find({});
        res.send(users);
        }
     catch (err) {
        res.status(400).send("Something went wrong")
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
        }
     catch (err) {
        res.status(400).send("Something went wrong")
    }
});

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully");
        }
     catch (err) {
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
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

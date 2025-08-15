const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
    // Validation of Data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

   const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash
   });
   
    await user.save();
    res.send("User added successfully");
   } catch (err) {
    res.status(400).send("ERROR :" + err.message);    
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

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            return res.status(400).send("Update not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate(userId, data, {
                returnDocument: "after",
                runValidators: true,
            });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED: " + err.message);
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

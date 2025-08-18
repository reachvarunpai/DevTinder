const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// ✅ API to get all received requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName photoUrl skills age gender");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ API to get all connections (accepted ones)
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
        .populate("fromUserId", "firstName lastName photoUrl skills age gender")
        .populate("toUserId", "firstName lastName photoUrl skills age gender");

        // 🔥 Fix: use `connections` instead of undefined variable
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId; 
            } else {
                return row.fromUserId; 
            }
        });

        res.json({
            message: "Connections fetched successfully",
            data,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId");  // ✅ fixed: no commas

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            if (req.fromUserId) hideUsersFromFeed.add(req.fromUserId.toString());  // ✅ safe check
            if (req.toUserId) hideUsersFromFeed.add(req.toUserId.toString());      // ✅ safe check
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select("firstName lastName photoUrl age gender about skills"); // ✅ fixed: no commas

        res.send(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;

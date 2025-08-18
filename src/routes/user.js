const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

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

module.exports = userRouter;

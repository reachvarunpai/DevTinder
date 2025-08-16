const express = require("express");
const profileRouter = express.Router();    
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcryptjs");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
   try { 
    const user = req.user;
    res.send(user);
   } catch (err) {
    res.status(400).send("ERROR :" + err.message);    
   }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
   try { 
    if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
    message: `${loggedInUser.firstName}, your profile updated successfully`,
    data: loggedInUser,
    });
   } catch (err) {
    res.status(400).send("ERROR :" + err.message);    
   }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
   try { 
        const { oldPassword, newPassword } = req.body;
      const user = req.user;
      if (!oldPassword || !newPassword) {
         return res.status(400).send("Both oldPassword and newPassword are required");
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
         return res.status(400).send("Old password is incorrect");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.send("Password updated successfully ✅");
   } catch (err) {
    res.status(400).send("ERROR :" + err.message);    
   }
});

module.exports = profileRouter;
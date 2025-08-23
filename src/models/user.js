const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password " + value);
            }
        },
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://tse4.mm.bing.net/th/id/OIP.9zsJAmSYTJEWaxoDi8uYigHaGl?pid=Api&P=0&h=180",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL: " + value);
            }
        },
    },
    about: {
        type: String,
        default: "This is default about the user",
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true,
}
);

// 🔑 JWT generator
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "7d",
    });
    return token;
};

// 🔑 Password validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    return await bcrypt.compare(passwordInputByUser, user.password);
};

module.exports = mongoose.model("User", userSchema);

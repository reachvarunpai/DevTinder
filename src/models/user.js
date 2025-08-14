const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
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
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data not valid");

            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://tse4.mm.bing.net/th/id/OIP.9zsJAmSYTJEWaxoDi8uYigHaGl?pid=Api&P=0&h=180"
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

module.exports = mongoose.model("User", userSchema);


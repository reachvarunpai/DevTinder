const mongoose = require("mongoose");

const connectDB = async () => {
await mongoose.connect(
    "mongodb+srv://namastedev:SQBhRVWHDKLsaa8W@namastenode.589b2qv.mongodb.net/devTinder"
);
};

module.exports = connectDB;
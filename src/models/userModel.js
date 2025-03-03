const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }, 
    bio: { type: String, default: "" },  
    profileImage: { type: String, default: "" }  
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

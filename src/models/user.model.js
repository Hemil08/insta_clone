const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"User name already exists"],
        required: [true, "User name is required"],
    },

    email:{
        type: String,
        unique: [true, "Email already exists"],
        required:[true, "Email is required"]
    },
    password:{
        type:String,
        required: [true, "Password is required"]
    },
    bio:String,
    profileImage:{
        type:String,
        default: "https://ik.imagekit.io/hke7hcc0q/default%20user.webp?updatedAt=1770743705273"
    }
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel
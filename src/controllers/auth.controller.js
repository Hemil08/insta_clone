const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerController(req,res){
    const { email, username, password, bio,  profileImage } = req.body

    const isUserExistsByEmail = await userModel.findOne({ email })

    // if(isUserExistsByEmail){
    //     return res.status(409).json({
    //         message: "user already exists with same email"
    //     })
    // }

    // const isUserExistsByUsername = await userModel.findOne({ username })

    // if (!isUserExistsByUserame){
    //     return res.status(409).json({
    //         message: "user already exists with same username"
    //     })
    // }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409)
               .json({
                    message: "User already exists" +  (isUserAlreadyExists.email == email ? "Email already exists" : "username already exists")
               })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password:hash
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(201).json({
        message:"User Registration successfully",
        user:{
            email: user.email,
            username : user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

}

async function loginController (req,res){
    const { username,email,password } = req.body
    
    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password )

    if(!isPasswordValid){
        return res.status(401).json({
            message: "password invalid"
        })
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(200)
    .json({
        message:"User loggedIn successfully."
    })
}

module.exports = {
    registerController,
    loginController
}
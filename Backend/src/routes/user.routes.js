const express = require("express")
const userController = require("../controllers/user.controller")
const followUserController = require("../controllers/user.controller")
const getFollowRequestsController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

const userRouter = express.Router()

// @route Post /api/users/follow/:userId
// @description Follow a user
// @access Private

userRouter.post("/follow/:userId",identifyUser,userController.followUserController)

// @route GET /api/users/follow-requests
// @description Followee can see the users with pending requests
// @access Private
userRouter.get("/follow-requests",identifyUser,userController.getFollowRequestsController)

// @route PUT /api/users/follow-request/{followerId}
userRouter.patch("/follow-request/:userId", identifyUser, userController.updateFollowRequestController)

// @route Post /api/users/unfollow/:username
userRouter.post("/unfollow/:userId", identifyUser, userController.unfollowUserController)
 

module.exports = userRouter
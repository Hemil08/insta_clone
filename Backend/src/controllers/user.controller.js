const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

async function followUserController(req,res){
    
    const followerUserId = req.user.id
    const followeeUserId = req.params.userId

    if (followerUserId == followeeUserId){
        return res.status(400).json({
            message:"You cannot follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        _id: followeeUserId
    })
    
    if(!isFolloweeExists){
        return res.status(404).json({
            message:"User you are trying to follow does not exists"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower : followerUserId,
        followee : followeeUserId,
        status : 'accepted'
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message: `You are already following ${followeeUserId}`,
            follow:isAlreadyFollowing
        })
    }

    const isRequestAlreadySent = await followModel.findOne({
        follower: followerUserId,
        followee: followeeUserId,
        status: 'pending'
    })

    if(isRequestAlreadySent){
        return res.status(200).json({
            message: `Request already sent to ${followeeUserId}`,
            follow: isRequestAlreadySent
        })
    }

    const followRecord = await followModel.create({
        follower: followerUserId,
        followee: followeeUserId,
        status: 'pending'
    })

    res.status(201).json({
        message: `Request has been successfully sent to ${followeeUserId}`,
        follow: followRecord
    })

}

async function getFollowRequestsController(req,res){
    const followeeUserId = req.user.id
    

    const requests = await followModel.find({
        followee: followeeUserId,
        status: "pending"
    })

    res.status(200)
    .json({
        message:"Requests fetched successfully.",
        requests
    })
}

async function updateFollowRequestController(req,res){
    const followeeUserId = req.user.id
    const followerUserId = req.params.userId
    const {action} = req.body

    const isFollowerExists = await followModel.findOne({
        follower: followerUserId,
        followee: followeeUserId,
    }) 

    if(!isFollowerExists){
        return res.status(404).json({
            message: "Follower does not exists",
        })
    }

    if(action == "accepted"){
        await followModel.findOneAndUpdate(
            {
            follower: followerUserId,
            followee : followeeUserId,
            },
            {
                $set: {status: "accepted"}
            },
            {new: true}
        )

        return res.status(200).json({
            message: `You accepted the request successfully from ${followerUserId}`
        })
    }

    if (action == "rejected"){
        await followModel.findByIdAndDelete(isFollowerExists._id)

        res.status(200).json({
        message: `You have unfollowed ${followerUserId}`
    })
    }

    return res.status(400).json({
    message: "Invalid action. Use 'accepted' or 'rejected'."
    })
}

async function unfollowUserController(req,res){
    const followerUserId = req.user.id
    const followeeUserId = req.params.userId

    const isUserFollowing = await followModel.findOne({
        follower: followerUserId,
        followee: followeeUserId,
    })

    if(!isUserFollowing){
        return res.status(200).json({
            message: `You are not following ${followeeUserId}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUserId}`
    })
}

module.exports = {
    followUserController,
    getFollowRequestsController,
    updateFollowRequestController,
    unfollowUserController,
}
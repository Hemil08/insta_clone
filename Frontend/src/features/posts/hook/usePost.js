import { useContext } from "react"
import { createPost, getFeed, likePost, unLikePost } from "../services/post.api"
import { PostContext } from "../post.context"
import { useEffect } from "react"

export const usePost = () => {

    const context = useContext(PostContext)

    const {loading, setLoading, post, setPost, feed, setFeed} = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    const handleCreatePost = async(imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed ([data.post, ...feed])
        setLoading(false)
    }

    const handleLike = async (post) => {
        setLoading(true)
        const data = await likePost(post)
        await handleGetFeed()
        setLoading(false)
    }

    const handleUnLike = async (post) => {
        setLoading(true)
        const data = await unLikePost(post)
        await handleGetFeed()
        setLoading(false)
    }

    useEffect(()=>{
        handleGetFeed()
    },[])

    return { loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }  
}
import React from 'react'
import "../style/feed.scss"
import Post from '../components/post'
import { usePost } from '../hook/usePost'
import { useEffect } from 'react'
import Nav from '../../shared/components/Nav'

const Feed = () => {

  const {feed,handleGetFeed,loading, handleLike, handleUnLike } = usePost()

  useEffect(()=>{
    handleGetFeed()
  },[])

  if(loading || !feed){
    return (<main><h1>Feed is Loading... </h1></main>)
  }

  return (
    <main className='feed-page'>
      <Nav/>
      <div className="feed">
        <div className="posts">
          {feed.map((post,index)=>{
            return <Post user={post.user} post={post} key={index} loading={loading} handleLike={handleLike} handleUnLike={handleUnLike}/>
          })}
        </div>
      </div> 
    </main>
  )
}

export default Feed
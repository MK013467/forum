import { api } from '@shared/lib/api';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

interface Post {
  id:number;
  title:string
  content:string
  createdAt:string
  comments:[]
  views:number
  likes:number
  authorId:number,
}

const OnePostPage = () => {

  const {postId = ""} = useParams();
  const [post, setPost ]= useState<Post|null>(null);

  useEffect(()=>{
    const fetchData = async(id:string) => {
      if(!id) {
        setPost(null);
        return;
      }
      const res = await api.get(`/post/${id}`);
      setPost(res.data);
    }
    if(postId){
      fetchData(postId)
    }
  }, [])

    if (!post) return <div>Loading...</div>;
    else{
      return(
        <div className="">
          <div className='flex items-center justify-between'>
            <span className=''>{post.title}</span>
            <span className=''>{post.createdAt}</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex item-center gap-10' >
                <span className=''>views {post.views}</span>
                <span className=''>likes {post.likes}</span>
                <span className=''>comments {post.comments.length}</span>
            </div>
          </div>

        </div>
      )
    }
    
  
}

export default OnePostPage
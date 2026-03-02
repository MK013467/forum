import { api } from '@shared/lib/api';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

interface Post {
  id:number;
  title:string
  content:string
  createdAt:string
  views:number
  likes:number
  authorId:number,
  author:Object
}

const OnePostPage = () => {

  const {postId = ""} = useParams();
  const [post, setPost ]= useState<Post|null>();

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

  return (

    <div className=''>

    </div>
  )
}

export default OnePostPage
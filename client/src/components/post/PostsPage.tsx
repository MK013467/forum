import { api } from '@shared/lib/api'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface Post {
  id:number;
  title:string
  content:string
  createdAt:string
  views:number
  likes:number
  authorName:number
}


const PostsPage = () => {

  const [posts, setPosts] = useState<Post[]> ([]);
  const navigate = useNavigate();

  
  // post.createdAt would be like "2026-03-02T13:51:14.420Z" with number of characters are fixed.
  const formatDate = (date:string) =>{
    return date.substring(5,10).replaceAll('-', ".");
  }


  //get posts from backend
  useEffect( ()=>{
    const fetchData = async () =>{
      const res = await api.get("/post");
      console.log(res.data);
      setPosts(res.data) ;

    };

    fetchData();
  },[]);

  //postDetail 
  const handleClickRow = (postId:number)=> {
    navigate(`/post/${postId}`)    
  }


  return (
    <div className='flex absolute inset-0 bg-white justify-center items-center'>
      <table className='w-4/5 border border-gray-300'>
        <thead>
          <tr className='border-b-2 border-gray-100 bg-gray-100 '>
            <th className='w-1/10'>Number</th>
            <th className='w-1/10 p-5 text-ml font-semibold'>title</th>
            <th className='w-2/5'>AuthorName</th>
            <th className=''>PostedAt</th>
            <th className=''>views</th>
            <th className=''>likes</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post)=>
          
            <tr key={post.id} onClick={()=> handleClickRow(post.id)} className='border-b-2 border-gray-100'>
              <th className='w-1/10'>{post.id}</th>
              <th className='w-3/10 p-5 text-sm'>{post.title}</th>
              <th className='w-1/10 '>{post.authorName}</th>
              <th className='w-1/10'>{formatDate(post.createdAt)} </th>
              <th className='w-1/10'>{post.views}</th>
              <th className=''>{post.likes}</th>
            </tr>
          )}
        </tbody>
      </table> 
    </div>
  )
}

export default PostsPage;

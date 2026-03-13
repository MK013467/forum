import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import React, { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import z from 'zod';

interface Post {
  id:number;
  title:string
  content:string
  createsAt:string
  comments:Comment[]
  views:number
  likes:number
  authorId:number,
  author:{
    username:string
  }
}

interface Comment{
  id:number;
  content:string
  createsAt:string
  likes:number;
  authorId:number;
  postId:number;
  author:{
    username:string
  }
}



const createCommentFormSchema = z.object({
  content: z.string()
});

type createCommentForm = z.infer<typeof createCommentFormSchema>;




const OnePostPage = () => {

  const navigate = useNavigate();

  //for posts
  const {postId = ""} = useParams();
  const [post, setPost ]= useState<Post|null>(null);


  //for comments 
  const [comments, setComments ] = useState<Comment[]>([]);

  const {register, handleSubmit, setError} = useForm<createCommentForm>({
    resolver:zodResolver(createCommentFormSchema),
    mode:'onChange'
  })

  const onCommentSubmit:SubmitHandler<createCommentForm> = async(data: any) => {
    try{
      const commentDto = {
        ...data,
        authorId : 1,
        postId: 1
      }
      console.log(commentDto);
      const response = await api.post('/comment',commentDto);
      console.log(response.data);
      setComments(prev => [...prev, response.data]);
      navigate('')
    }
    catch(err:any){
      console.log(err.response?.data);
    }
  }


  useEffect(()=>{
    const fetchData = async(id:string) => {
      if(!id) {
        setPost(null);
        return;
      }
      const res = await api.get(`/post/${id}`);
      setPost(res.data);
      setComments(res.data.comments)
    }
    if(postId){
      fetchData(postId)
    }
  }, [])

    if (!post) return <div>Loading...</div>;
    else{
    }

      return(
        <div className="w-full px-80 p-4 text-base">
          <div className='flex items-center justify-between mb-8'>
            <span className='font-bold text-2xl'>{post.title}</span>
            <span className=''>{post.createsAt.substring(0,10)}</span>
          </div>
          <div className='flex items-center justify-between'>
                <span className=''>{post.author.username}</span>
                <div className='flex flex-end gap-10'>
                  <span className=''>views {post.views}</span>
                  <span className=''>likes {post.likes}</span>
                  <span className=''>comments {post.comments.length}</span>
                </div>

          </div>
          <div className='py-4'>
              <p className='px-2'> {post.content}</p>
          </div>
          <form onSubmit={handleSubmit(onCommentSubmit)}
          className='flex flex-col gap-2 mt-4'>
              <input {...register('content')} placeholder='Text'
              className='w-full border rounded-xl p-4'/>
              <button 
              type='submit'
              className='self-end border rounded-xl border-gray-400 text-white font-bold bg-blue-400 p-4 py-2'> comment
              </button>
          </form>{comments.map((comment, index) =>
        <div key={index} className='flex flex-col gap-1 py-3 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-semibold text-gray-700'> {comment.author.username}</span>
            <span className='text-xs text-gray-400'>{comment.createsAt.substring(0, 10)}</span>
          </div>
          <p className='text-gray-600 text-sm'>{comment.content}</p>
          <div className='flex items-center gap-1 text-xs text-gray-400'>
            <span>👍</span>
            <span>{comment.likes}</span>
          </div>
        </div>
)}

        </div>
      )
}
    
  
  

export default OnePostPage
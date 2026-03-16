import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import  { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import z from 'zod';
import { useAuth } from '../auth/AuthContext';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useQuery , useMutation } from '@tanstack/react-query';
import {useQuery} from '@tanstack/Query';

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

const fetchPost = async (postId:num)=>{
  const response = await api.get('post/${postId}')
};


const OnePostPage = () => {

  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);
  //for posts
  const {postId = ""} = useParams();
  const [post, setPost ]= useState<Post|null>(null);
 const{data:post,isLoading, isError, error} = useQuery<Post>({
     queryKey:['post',postId],
     queryFn: (postId:num) =>fetchPost(postId)
})

  //for comments 
  const [comments, setComments ] = useState<Comment[]>([]);
  const [actionError, setActionError] = useState('');


  const {register, handleSubmit, setError} = useForm<createCommentForm>({
    resolver:zodResolver(createCommentFormSchema),
    mode:'onChange'
  })

  const onCommentSubmit:SubmitHandler<createCommentForm> = async(data: any) => {
    try{
      const commentDto = {
        ...data,
        authorId : user?.id,
        postId: postId
      }
      const response = await api.post('/comment',commentDto);
      setComments(prev => [...prev, response.data]);
      navigate('')
    }
    catch(err:any){
      console.log(err.response?.data);
    }
  }

  const handlePostLike = async (postId:number) =>{
    try{
      const data = {
        targetId: postId,
        type:'like'
      }
      setActionError('')
      api.post("/like/post", data);
      setActionError('');
    }
    catch(err:any ){
      setActionError(err.response?.data?.message || 'Failed to like post');
    }
  }

  const handlePostDislike = async (postId:number) =>{
    try{
      const data = {
        targetId: postId,
        type:'dislike'
      }
      setActionError('');
      api.post("/like/post", data);
      
    }

    catch(err:any ){
      setActionError(err.response?.data?.message || 'Failed to dislike post');
    }
  }


  const handleCommentLike = async (commentId:number) =>{
    try{
      const data = {
        targetId: commentId,
        type:'like'
      }
      setActionError('')
      api.post("/like/comment", data);
    }
    catch(err:any ){
      setActionError(err.response?.data?.message || 'Failed to like comment');
    }
  }

  const handleCommentDislike = async (commentId:number) =>{
    try{
      const data = {
        targetId: commentId,
        type:'dislike'
      }
      setActionError('')
      api.post("/like/comment", data);
    }
    catch(err:any ){
      setActionError(err.response?.data?.message || 'Failed to dislike comment');

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
        <div className="w-full min-h-screen px-80 p-4 text-base ">
          <div className='flex items-center justify-between mb-6 border-b border-gray-200 pb-4'>
            <span className='font-bold text-3xl tracking-tight'>{post.title}</span>
            <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>{post.createsAt.substring(0,10)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center rounded-full bg-sky-50 px-4 py-2 font-semibold text-sky-700">
            <span>views {post.views}</span>
          </div>

            <div className="flex items-center gap-2">
              <button disabled={!user}
                onClick={() => handlePostLike(post.id)}
                className={`flex items-center gap-1 rounded-full px-2 py-2 text-gray-700 ${user? 'hover:bg-blue-50 hover:text-blue-700 transition':''}`}
              >
                <ThumbsUp className="w-4 h-4" />
                {post.likes > 0 && <span>{post.likes}</span>}
              </button>

              <button disabled={!user}
                onClick={() => handlePostDislike(post.id)}
                className={`flex items-center gap-1 rounded-full px-2 py-2 text-gray-700 ${user? ' hover:bg-rose-50 hover:text-rose-700 transition':''}`}
              >
                <ThumbsDown className="w-4 h-4" />
                {post.likes < 0 && <span>{post.likes}</span>}
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <div className='py-4'>
              <p className='px-2'> {post.content}</p>
          </div>
          <form onSubmit={handleSubmit(onCommentSubmit)}
          className='flex flex-col gap-2 mt-4'>
              {user && <textarea {...register('content')} placeholder='Text'
              className='w-full min-h-32 border rounded-xl p-4'/>}

              {user && 
              <button 
              type='submit'
              className='self-end border rounded-xl border-gray-400 text-white font-bold bg-blue-400 p-4 py-2'> comment
              </button>
              }
              
          </form>{comments.map((comment, index) =>
        <div key={index} className='flex flex-col gap-1 py-3 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-semibold text-gray-700'> {comment.author.username}</span>
            <span className='text-xs text-gray-400'>{comment.createsAt.substring(0, 10)}</span>
          </div> 
          <p className='text-gray-600 text-sm'>{comment.content}</p>
          <div className='flex items-center gap-1 text-xs text-gray-400'>
            <div className='flex flex-1 mt-2'> 
              <button disabled={!user}
              onClick={()=> handleCommentLike(comment.id)}
              className='w-10 h-10 flex bg-white gap-1'>
                <ThumbsUp className='w-4 h-4'/>
                {comment.likes>=0 && <span>{comment.likes}</span>}
              </button>
              
              <button disabled={!user}
              onClick={() => handleCommentDislike(comment.id)}
              className='w-10 h-10 flex bg-white gap-1'>
                <ThumbsDown className='w-4 h-4'/>
                {comment.likes<0 && <span>{comment.likes}</span>}
              </button>
            </div>
            <div>
              <span>{comment.likes}</span>
            </div>
          </div>
          
        </div>
        )}
        
        </div>
      )
}
    
export default OnePostPage
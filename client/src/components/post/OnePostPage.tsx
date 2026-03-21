import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {z} from 'zod';
import { useAuth } from '../auth/AuthContext';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query';

// post interface
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

const fetchPost = async (postId:number)=>{
  const response = await api.get(`/post/${postId}`)
  return response.data;
};


const OnePostPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {postId} = useParams();
  const{data:post,isLoading, isError, error} = useQuery<Post>({
     queryKey:['post',postId],
     queryFn: () =>fetchPost(Number(postId))
})

    //for comments 

  
    const {register, handleSubmit, setError} = useForm<createCommentForm>({
      resolver:zodResolver(createCommentFormSchema),
      mode:'onChange'
    })

    const createCommentMutation = useMutation({
      mutationFn: async(data:createCommentForm) =>{
        return await api.post('/commnet', data);
      },
      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['post', postId]})
      }
    })

    const postLikeMutation = useMutation({
      mutationFn: async({type}: {type:'like'|'dislike'} ) => {
        return await api.post("/like/post", {
          targetId: postId,
          type:type
        })
      }
      ,
      onSuccess: () =>{
        queryClient.invalidateQueries()
      }
    })

    const commentLikeMutation = useMutation({
      mutationFn: async({commentId, type}: {commentId:number ,type:'like'|'dislike'}) =>{
        return await api.post("/like/comment", {
          targetId: commentId,
          type:type
        })
      },

      onSuccess: () => {

      }
    })
    
    const handlePostDelete = () => {

    }

    const onCommentSubmit:SubmitHandler<createCommentForm> = async (data) => {
      createCommentMutation.mutate(data);
    }

    const handlePostLike = () => {
      postLikeMutation.mutate({type:'like'});
    }

    const handlePostDislike = () => {
      postLikeMutation.mutate({type:"dislike"});
    }

    const handleCommentLike = (commentId:number) => {
      commentLikeMutation.mutate({commentId:commentId, type:'like'});
    }

    const handleCommentDislike = (commentId:number) => {
      commentLikeMutation.mutate({commentId:commentId, type:'dislike'});
    }



    if (isLoading) return <div>Loading...</div>;
    else{

      if (!post) {
        return <div>Post not found</div>;
      }
      const comments = post.comments;
    

      return(
        <div className="w-full min-h-screen overflow-hidden px-3 md:px-20 lg:px-80 text-base">
          <div className='flex items-center justify-between border-b border-gray-200 my-6 lg:my-0 lg:mb-4 pb-4'>
            <span className='font-bold text-2xl md:text-3xl tracking-tight'>{post.title}</span>
            <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>{post.createsAt.substring(0,10)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm md:gap3">
          <div className="flex items-center rounded-full bg-sky-50 px-4 py-2 font-semibold text-sky-700">
            <span>views {post.views}</span>
          </div>

            <div className="flex items-center gap-2">
              <button disabled={!user}
                onClick={() => handlePostLike()}
                className={`flex items-center gap-1 rounded-full px-2 py-2 text-gray-700 ${user? 'hover:bg-blue-50 hover:text-blue-700 transition':''}`}
              >
                <ThumbsUp className="w-4 h-4" />
                {post.likes > 0 && <span>{post.likes}</span>}
              </button>

              <button disabled={!user}
                onClick={() => handlePostDislike()}
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
              <p className='px-2 break-words'> {post.content}</p>
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
              
          </form>{comments?.map((comment, index) =>
        <div key={index} className='flex flex-col gap-1 py-3 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-semibold text-gray-700'> {comment.author.username}</span>
            <span className='text-xs text-gray-400'>{comment.createsAt.substring(0, 10)}</span>
          </div> 
          <p className='text-gray-600 text-sm break-words'>{comment.content}</p>
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
      )}
}
    
export default OnePostPage
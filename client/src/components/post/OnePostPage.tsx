import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z} from 'zod';
import { useAuth } from '../auth/AuthContext';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

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
const updatePostFormSchema = z.object( {
  title: z.string().min(1, 'title is required'),
  content: z.string()
})

type updatePostForm = z.infer<typeof updatePostFormSchema>


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
  const [isEditing , setIsEditing] = useState<boolean>(false);


  const{data:post,isLoading, isError, error} = useQuery<Post>({
     queryKey:['post',postId],
     queryFn: () =>fetchPost(Number(postId))
})

    //for comments 

  
    const {register:updateRegister, handleSubmit:handleUpdateSubmit} = useForm<updatePostForm>({
        defaultValues: {
          title: post?.title,
          content: post?.content
        },
        resolver:zodResolver(updatePostFormSchema),
        mode:'onChange'
      });

   

    const {register, handleSubmit, setError} = useForm<createCommentForm>({
      resolver:zodResolver(createCommentFormSchema),
      mode:'onChange'
    })

    const createCommentMutation = useMutation({
      mutationFn: async(data:createCommentForm) =>{
        return await api.post('/comment', {...data, authorId:post?.authorId, postId:post?.id });
      },

      onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['post', postId]})
      },

      onError:()=> {

      }
    })
    const updatePostMutation = useMutation({
      mutationFn: async (data: updatePostForm) => {
        return await api.patch(`/post/${postId}`, data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['post', postId] }); // 'postId' 문자열 아니고 변수
        setIsEditing(false); // navigate('/') 말고 이걸로
      }
    });

    const deletePostMutation = useMutation({
      mutationFn: async () => {
        return await api.delete(`/post/${postId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        navigate('/post?page=1');
      },
      onError: (err: any) => {
        console.log(err.response?.data || err.message);
      },
    });

    const postLikeMutation = useMutation({
      mutationFn: async({type}: {type:'like'|'dislike'} ) => {
        return await api.post("/like/post", {
          targetId: postId,
          type:type
        })
      }
      ,

      // The value returned from this function will be passed to the onSuccess, onError, and onSettled functions and can be useful for rolling back optimistic updates.
      onMutate: async({type}) =>{
        
        await queryClient.cancelQueries({queryKey:['post', postId]});
        const previousPost = queryClient.getQueryData(['post', postId]);

        //Update UI
        queryClient.setQueryData(['post', postId], (old:Post) => ({
          ...old,
          likes: type === 'like' ? old.likes+1 : old.likes-1
        }))
        return {previousPost}
      },



      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:['post' , postId]})
      },

      onError: ( err, variable, context) =>{
        queryClient.setQueryData(['post', postId], context?.previousPost);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['post', postId] });

      }
    })

    const commentLikeMutation = useMutation({
      mutationFn: async({commentId, type}: {commentId:number ,type:'like'|'dislike'}) =>{
        return await api.post("/like/comment", {
          targetId: commentId,
          type:type
        })

      },

      onMutate: async (   ) => {
          await queryClient.cancelQueries({queryKey:['post', postId]});
          const previousPost = queryClient.getQueryData(['post', postId]);
          // const previousComments = previousPost?.comments?

          return {previousPost}
      },

      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:['post', postId]})
      
      },

      onError: (err, variable, context) => {
        queryClient.setQueryData(['post', postId] , context?.previousPost)
      },

      onSettled: () => {

      }
    })
    

    const onCommentSubmit:SubmitHandler<createCommentForm> = async (data) => {
      createCommentMutation.mutate(data);
    }

    const handlePostUpdate: SubmitHandler<updatePostForm> = (data) => {
      updatePostMutation.mutate(data);
    }

    const handlePostDelete = () => {
      deletePostMutation.mutate();
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

    if(isError) return <div> Something went wrong {error.message}</div>
    if (isLoading) return <div>Loading...</div>;

    else{

      if (!post) {
        return <div>Post not found</div>;
      }
      const comments = post.comments;
    
    
      return( 
        <div className="w-full min-h-screen overflow-hidden px-3 md:px-20 lg:px-80 text-base">
          <div className='flex flex-col gap-3 border-b border-gray-100 pb-5 mb-6'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100'>
              {post.createsAt.substring(0, 10)}
            </span>

            {user?.id === post.authorId && (
              <div className='flex items-center gap-2'>
                <button 
                className='text-xs font-medium text-orange-500 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors'
                onClick={() => setIsEditing(!isEditing)}
                >
                  Edit
                </button>
                <button
                  onClick={handlePostDelete}
                  className='text-xs font-medium text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors'>
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {/* title */}
          {isEditing ? (
          <input
            {...updateRegister('title')}
            className='w-full border rounded-lg p-2 text-2xl font-bold tracking-tight'
          />
        ) : (
          <h1 className='font-bold text-2xl md:text-3xl tracking-tight text-gray-900 leading-snug'>
            {post.title}
          </h1>
        )}
         

          
          
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
          <div className='flex py-4'>
             
       
          {isEditing ? (
            <form onSubmit={handleUpdateSubmit(handlePostUpdate)} className='flex flex-col gap-2 py-4'>
              <textarea
                {...updateRegister('content')}
                className='w-full min-h-40 border rounded-xl p-2'
              />
              <button
                type='submit'
                className='self-end text-xs bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors'>
                Save
              </button>
            </form>
          ) : (
            <div className='flex py-4'>
              <p className='px-2 break-words'>{post.content}</p>
            </div>
          )}
              
          </div>

          {/* for comment */}

          {/*createComentForm */}
          <form onSubmit={handleSubmit(onCommentSubmit)}
          className='flex flex-col gap-2 mt-4'>
              {user && <textarea {...register('content')} placeholder='Text'
              className='w-full min-h-20 md:min-h-30 border rounded-xl p-2'/>}

              {user && 
              <button 
              type='submit'
              className='self-end border rounded-xl border-gray-400 text-white font-bold bg-blue-400 p-4 py-2'> comment
              </button>
              }
              
          </form>
        
        {comments?.map((comment, index) =>
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
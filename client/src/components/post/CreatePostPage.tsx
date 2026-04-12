import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../api';
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import z from 'zod'
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from 'src/store/useAuthStore';

const createPostFormSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string()
});


type createPostForm = z.infer<typeof createPostFormSchema>

const CreatePostPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state)=>state.user);
  if(!user){
    toast.error("You should log in to create a new post",{
      position:"bottom-center",
      autoClose:2000,
      hideProgressBar:true
    })
    navigate("/");
  }


  const {register, handleSubmit , setError,
    formState:{ errors , isSubmitting, isValid}} = useForm<createPostForm>({
      resolver:zodResolver(createPostFormSchema),
      mode:'onChange'
    });

  const createPostMutation = useMutation({
    mutationFn: async(data:createPostForm) => {
      const res = await api.post('/post', data)
      return res.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/')
    },

    onError:(error) => {
      console.log(error.message);
    }
  })


  const onSubmit:SubmitHandler<createPostForm> = async (data) => {
    createPostMutation.mutate(data);
  }

  return (
      <div className='w-3/5 max-w-4xl p-4'>
        <h1 className='text-2xl font-bold'>Create a new Post</h1>
        <form  onSubmit={handleSubmit(onSubmit)} className='w-full relative pb-10'>
          {/* title */}
          <input {...register("title")} type='text'  placeholder='Title' className='w-full bg-white border rounded-2xl border-gray-400 p-4 my-4'/>
          {/* content */}
          <span className='text-red-500'>{errors&& errors.root?.message as string}</span>
          <textarea {...register("content" )}placeholder='Text(Optional)'
           className='w-full h-3/5 min-h-40 bg-white border rounded-3xl border-gray-400 p-4 my-4
           resize-none align-top'/>
          <button disabled={!isValid || isSubmitting}
          type='submit' className={`absolute right-0 bottom-0 rounded-2xl text-white font-bold
           bottom-0 p-4 ${isValid? "bg-blue-500 cursor not-allowed": 'bg-sky-400'}}`}>{isSubmitting? 'Submitting':'Post'}</button>
        </form>
       </div>
      
    
  )
}

export default CreatePostPage
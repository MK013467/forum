import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import React, { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import z from 'zod'

const createPostFormSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string()
});


type createPostForm = z.infer<typeof createPostFormSchema>

const CreatePostPage = () => {

  const navigate = useNavigate();

  const {register, handleSubmit , setError,
    formState:{ errors , isLoading, isValid}} = useForm<createPostForm>({
      resolver:zodResolver(createPostFormSchema),
      mode:'onChange'
    });

  const onSubmit:SubmitHandler<createPostForm> = async (data) => {
    try{
      const response = await api.post("/post", data);
      console.log(response.data);

      navigate('')
    } 

    catch(err:any){
      console.log(err.response?.data);
      console.log(err.response?.status);    }
  }

  return (
      <div className='w-3/5 max-w-4xl p-4'>
        <h1 className='text-2xl font-bold'>Create a new Post</h1>
        <form  onSubmit={handleSubmit(onSubmit)} className='w-full relative pb-8'>
          {/* title */}
          <input {...register("title")} type='text'  placeholder='Title' className='w-full bg-white border rounded-2xl border-gray-400 p-4 my-4'/>
          {/* content */}
          <span className='text-red-500'>{errors&& errors.root?.message as string}</span>
          <textarea {...register("content" )}placeholder='Text(Optional)'
           className='w-full h-3/5 min-h-40 bg-white border rounded-3xl border-gray-400 p-4 my-4
           resize-none align-top'/>
          <button disabled={!isValid}
          type='submit' className={`absolute right-0 rounded-xl text-gray-400 font-bold
           bottom-0 p-4 ${isValid? "bg-gray-400 cursor not-allowed": 'bg-red-500'}}`}>Post</button>
        </form>
       </div>
      
    
  )
}

export default CreatePostPage
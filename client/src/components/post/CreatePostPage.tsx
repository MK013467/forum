import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const createPostFormSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string().min(1, 'content is required'),
  
});


type createPostForm = z.infer<typeof createPostFormSchema>

const CreatePostPage = () => {
  return (
    <div className='flex min-h-screen bg-gray-100 items-center justify-center px-4'>
      <div className='w-3/5 max-w-4xl p-4'>
        <h1 className='text-2xl font-bold'>Create a new Post</h1>
        <form className='w-full relative pb-8'>
          {/* title */}
          <input type='text' placeholder='Title' className='w-full bg-white border-gray-100 p-2 my-4'/>
          {/* content */}
          <input type='text'placeholder='Text(Optional)' className='w-full h-3/5 min-h-40 bg-white border-gray-100 p-2 my-4'/>
          <button type='submit' className='absolute right-0 rounded-xl text-white font-bold bottom-0 bg-amber-500 px-4 p-2'>Post</button>
        </form>
      </div>
      
    </div>
  )
}

export default CreatePostPage
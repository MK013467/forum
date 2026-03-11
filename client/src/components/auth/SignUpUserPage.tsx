import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import React, { useState } from 'react'
import {useForm, type SubmitHandler} from "react-hook-form";
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import {z} from "zod";

const SignUpUserFormSchema = z.object({

  username:z.string().min(1, "username must be at least 1 characters")
  .max(20,"username must not exceed 20 characters"),

  password:z.string().min(8, "Must be at least 8  characters")
    .max(20, "Must not exceed 20 characters")

    .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character")
    .regex(/[0-9]/, "Must contain at least one number"),

    email: z.string().email("Invalid email address")
  });

type userForm = z.infer<typeof SignUpUserFormSchema>;



const SignUpUser = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register , handleSubmit, formState: {errors} } = useForm<userForm>({
    resolver: zodResolver(SignUpUserFormSchema)
  });

  const onSubmit:SubmitHandler<userForm> = async (data) => {
    console.log("FORM SUBMITTED"); // 👈 add this

    try{
      const response = await api.post("/user/signup", data);
      console.log("Success:"+response.data);
      navigate("/")
    }

    catch(error:any){
      console.error(error.response?.data);

    }   
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-4/5 max-w-2xl bg-white border rounded-lg border-gray-200 text-base p-8 py-12 w-80 sm:w-[352]'>
       <p className='text-gray-900 text-3xl font-medium mb-4'>
        Sign Up
      </p>
      <input {...register("username")} type='text' placeholder='username' className='w-full border rounded-2xl border-gray-200 p-4 py-2 mb-4'/>
        {errors.username && (
          <span className="text-red-500 text-sm">
            {errors.username.message}
          </span>
        )}
      <input {...register("email")} type='email' placeholder='email' className='w-full border rounded-2xl p-4 py-2 mb-4'/>

        {errors.email && (
          <span className="text-red-500 text-sm">
            {errors.email.message}
          </span>
        )}
      <div
      className='w-full relative'>
        <input {...register("password")} type={showPassword? 'text':'password'} placeholder='password' className='w-full  border rounded-2xl p-3 my-2 mb-2'/> 
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
       
       <button type="button" 
          onClick={() => setShowPassword(prev => !prev)}
          className="aspect-square
          absolute right-4 top-1/2 -translate-y-1/2"> 
            {showPassword? <GoEyeClosed/>: <GoEye/> }
        </button >
      </div>
      <button type='submit' className='w-full mt-2 bg-indigo-500 rounded-2xl p-4 py-4 text-white text-l font-semibold' > Sign Up</button>

    </form>
  )
}

export default SignUpUser
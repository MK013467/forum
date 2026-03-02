import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import React from 'react'
import {useForm, type SubmitHandler} from "react-hook-form";
import {z} from "zod";

const SignUpUserFormSchema = z.object({

  username:z.string().min(6, "username must be at least 6 characters")
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


  const { register , handleSubmit} = useForm<userForm>({
    resolver: zodResolver(SignUpUserFormSchema)
  });

  const onSubmit:SubmitHandler<userForm> = async (data) => {
    console.log("FORM SUBMITTED"); // 👈 add this

    try{
      const response = await api.post("/user/signup", data);
      console.log("Success:"+response.data);
    }

    catch(error:any){
      console.error(error.response?.data);

    }   
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-4/5 max-w-3xl bg-white border rounded-lg border-gray-200 text-base p-8 py-12 w-80 sm:w-[352]'>
       <p className='text-gray-900 text-3xl font-medium'>
        회원가입
      </p>
      <input {...register("username")} type='text' placeholder='아이디' className='w-full border rounded-2xl border-gray-200 p-4 py-2 mb-4'/>
      <input {...register("email")} type='email' placeholder='이메일' className='w-full border rounded-2xl p-4 py-2 mb-4'/>
      <input {...register("password")} type='password' placeholder='비밀번호' className='w-full  border rounded-2xl p-4 my-2 mb-4'/> 
      <button type='submit' className='w-full mt-2 bg-indigo-500 rounded-2xl p-4 py-4 text-white text-l font-semibold' > 회원가입</button>

    </form>
  )
}

export default SignUpUser
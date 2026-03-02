import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useForm, type SubmitHandler} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import { GoEye } from 'react-icons/go';
import { GoEyeClosed } from "react-icons/go";

const LoginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof LoginFormSchema>;


const LoginUserPage = () => {

  const { register , handleSubmit,  setError, 
    formState:{errors, isValid }} = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange"
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
    


  const onSubmit:SubmitHandler<LoginForm> = async (data) => {
    try{
      const response = await api.post("/auth/login", data);
      console.log("Success:"+response.data);
      navigate("/")
    }

    catch(error:any){
      console.log("LOGIN ERROR:", error.response?.data);

      setError("root", {
        type: "server",
        message:
          error.response?.data?.message ||
          "아이디 또는 비밀번호가 잘못되었습니다",
      });
    }   
  }
  
  return (

    <form onSubmit={handleSubmit(onSubmit)}
    className='w-3/4 max-w-3xl bg-white border rounded-lg border-sky-400 text-base p-8 py-12 w-80 sm:w-[352]'>
      <p className='text-sky-500 text-3xl font-medium'>
        Login
      </p>
      <input {...register("username")} type='text' placeholder='username or email' className='w-full border bg-slate-100 rounded-2xl border-sky-400 p-4 py-2 my-4'/>
      <div className='w-full relative my-2'>
        <input {...register("password")} type={showPassword? 'text':'password'} placeholder='password' className='w-full bg-slate-100 border rounded-2xl border-sky-400 px-4 py-2 pr-12'/>
        <button type="button" 
        onClick={() => setShowPassword(prev => !prev)}
        className="aspect-square
        absolute right-4 top-1/2 -translate-y-1/2"> 
          {showPassword? <GoEyeClosed/>: <GoEye/> }
        </button >
      </div>
      <p className='text-red-500'>{errors&& errors.root?.message as string}</p>
      <Link to={'/user/signup'} className='text-indigo-500 text-sm'>Forgot a Password?</Link>
      <button   disabled={!isValid}
        type='submit'
        className={`w-full mt-2 rounded-2xl p-4 py-2 text-white text-l font-semibold 
        ${!isValid ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500"}
        `}> Login</button>
    <p className="text-gray-500 text-sm mt-3 mb-11">Don’t have an account? <Link className="text-indigo-500" to={'/user/signup'}> Sign up </Link> </p>
    </form>
  )
}

export default LoginUserPage
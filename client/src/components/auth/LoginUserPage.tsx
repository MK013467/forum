import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useForm, type SubmitHandler} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@shared/lib/api';
import { GoEye } from 'react-icons/go';
import { GoEyeClosed } from "react-icons/go";
import { useAuth } from './AuthContext';
import {toast} from 'react-toastify';

const LoginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof LoginFormSchema>;


const LoginUserPage = () => {
  
  const { setUser } = useAuth();
  const { register , handleSubmit,  setError, 
    formState:{errors, isValid , isSubmitting}} = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange"
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
    


  const onSubmit:SubmitHandler<LoginForm> = async (data) => {
    try{
      const response = await api.post("/auth/login", data);
      setUser(response.data.user);
      toast.success("Login Successfully!",{
        position:"bottom-center",
        autoClose:2000,
        hideProgressBar:true
      })
      navigate('/');
    }

    catch(error:any){
      setError("root", {
        type: "server",
        message:
          error.response?.data?.message ||
          "Invalid username or password does not match",
      });
      toast.error("Invalid username or password does not match",{
        position:"bottom-center",
        autoClose:2000,
        hideProgressBar:true
      })
    }   
  }
  
  return (

    <form onSubmit={handleSubmit(onSubmit)}
    className='w-4/5 max-w-2xl bg-white border rounded-lg border-gray-200 text-base p-8 py-12 sm:w-[352]'>
      <p className='font-gray-900 text-3xl font-medium mb-4'>
        Login
      </p>
      <input {...register("username")} type='text' placeholder='username or email' className='w-full border bg-whit rounded-2xl border-gray-200 p-4 py-2 my-4'/>
      <div className='w-full relative my-2'>
        <input {...register("password")} type={showPassword? 'text':'password'} placeholder='password' className='w-full bg-white border rounded-2xl border-gray-200 px-4 py-2 pr-12'/>
        <button type="button" 
        onClick={() => setShowPassword(prev => !prev)}
        className="aspect-square
        absolute right-4 top-1/2 -translate-y-1/2"> 
          {showPassword? <GoEyeClosed/>: <GoEye/> }
        </button >
      </div>
      <p className='text-red-500'>{errors&& errors.root?.message as string}</p>
      <Link to={'/auth/signup'} className='text-indigo-500 text-sm'>Forgot a Password?</Link>
      <button   disabled={!isValid || isSubmitting}
        type='submit'
        className={`w-full mt-2 rounded-2xl p-4 py-2 text-white text-l font-semibold 
        ${!isValid ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500"}
        `}> {!isSubmitting? 'Login':'Submitting'}</button>
    <p className="text-gray-500 text-sm mt-3 mb-11">Don’t have an account? <Link className="text-indigo-500" to={'/auth/signup'}> Sign up </Link> </p>
    </form>
  )
}

export default LoginUserPage
import { api } from '../../api';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ResetPasswordPage = () => {

    const [step, setStep] = useState<'email'|'code'>('email');
    const [email , setEmail] = useState("");
    const [code , setCode] = useState("");
    const navigate = useNavigate();

    const sendVerifcationCode = async (email:string)=> {
        
        const res = await api.post("/auth/send-email", {email:email});
        if( step === 'email') setStep('code');
        navigate(`/auth/checkvc?email=${email}`)
        return;
    }

    const validateEmail = () =>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailRegex.test(email)
    }

    let isEmailValid = !validateEmail();
 
  return (
    <div className='w-2/5 max-w-3xl border rounded-2xl border sky-400
    text-base p-8 py-12 sm:w-[352]'>
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                sendVerifcationCode(email);
            }}
            className='w-full min-h-64 relative'
        >
            <input
                type='text' 
                placeholder='your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border rounded-2xl border-gray-200 p-4 py-2 mb-4'
            />
            <button 
            type='submit' 
            disabled={isEmailValid}
            className='w-full mt-2 bg-indigo-500 rounded-xl p-6 py-4 text-white text-l font-semibold'>
                Send Verification Code
            </button>

            <input className=''/>
         

            <Link to={"/auth/find-username"} className='absolute left-2 bottom-4 text-indigo-500 text-sm'>Forgot your username?</Link>
            
        </form>
    </div>
  )
}

export default ResetPasswordPage
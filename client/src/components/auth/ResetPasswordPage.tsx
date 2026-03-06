import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ResetPasswordPage = () => {

    const [username , setUsername ] = useState("");

    const handleUserNameSubmit = (input:string)=>{
        setUsername(input);
    }

  return (
    <div className='w-2/5 max-w-3xl bg-red border rounded-2xl border sky-400
    text-base p-8 py-12 sm:w-[352]'>
        <form className='w-full min-h-64 relative'>
            <input type='text' placeholder='your username' className='w-full border bg-slate-100 rounded-2xl border-sky-400
            p-4 py-4 my-4'/>
            <button type='submit'
            className='absolute bottom-32 bg-sky-400 right-0 mt-2 rounded-2xl p-4 py-2 text-white'>
                Next
            </button>
            <Link to={"/auth/find-username"} className='absolute left-2 bottom-4 text-indigo-500 text-sm'>Forgot your username?</Link>
        </form>
    </div>
  )
}

export default ResetPasswordPage
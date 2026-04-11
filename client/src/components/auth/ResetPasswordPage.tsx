import { api } from '../../api';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const sendVerificationCode = async (email: string) => {
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/send-email", { email });
      navigate(`/auth/checkvc?email=${email}`);
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-2/5 max-w-3xl border rounded-2xl border-sky-400
      text-base p-8 py-12 sm:w-[352px]'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendVerificationCode(email);
        }}
        className='w-full min-h-64 relative'
      >
        <input
          type='email'
          placeholder='your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border rounded-2xl border-gray-200 p-4 py-2 mb-4'
        />

        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

        <button
          type='submit'
          disabled={!validateEmail() || loading}
          className='w-full mt-2 bg-indigo-500 rounded-xl p-6 py-4 text-white 
            text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>

        <Link to={"/auth/find-username"} className='absolute left-2 bottom-4 text-indigo-500 text-sm'>
          Forgot your username?
        </Link>
      </form>
    </div>
  )
}

export default ResetPasswordPage
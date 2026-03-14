import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserLarge } from "react-icons/fa6";
import useCheckLogin from './hooks/useCheckLogin';
import {api} from "@shared/lib/api";
import { useAuth } from './auth/AuthContext';
interface HeaderProps{
  children?:React.ReactNode
}
const Headers = () => {
  const {user} = useAuth();
  const isAuthenticated = user!= null;

  const handleSignUp = async () => {
    try{
      const response = await api.post
    }
    catch(err){
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 bg-white text-gray-800 border-b border-gray-900 px-40">
      <div className='flex items-center justify-between'>
      {/* ixed inset-x-0 top-0 z-50 left-0 bg-white text-gray-700 body-font border-b border-gray-200 */}
        {/* Logo */}
        <Link to="/" className="bg-[url('/blog_forum_logo.svg')] bg-cover bg-center w-40 h-20">
          
        </Link>

        <nav className='flex gap-20'>

          {!isAuthenticated&&
            <Link 
              to="/auth/signup"
              className='' onClick={handleSignUp}>
                SignUp
            </Link>}

          {isAuthenticated &&
            <Link
            to="/auth/logout"
            className=''>
              Logout
            </Link>}
          
          {!isAuthenticated && 
            <Link
              to="/auth/login"
              className=''>
                Login
            </Link>}

          <Link 
            to="/user/profile"
            className=''>
              <FaUserLarge className='w-10 h-10'/>
          </Link>

        </nav>
      </div>
    </header>
  );
};
export default Headers
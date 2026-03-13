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
  const authContext = useAuth();
  const isAuthenticated = authContext.user!= null;

  const handleSignUp = async () => {
    try{
      const response = await api.post
    }
    catch(err){
    }
  }

  return (
    <header className="w-full bg-blue-400 sticky top-0 z-50 shadow-md px-4 py-4">
      <div className='max-6-xl flex items-center justify-between'>
        {/* Logo */}
        <Link to="/" className="w-4 bg-[url('/background.jpg')] bg-cover bg-center w-20 h-20">
          
        </Link>

        <nav className='flex gap-20'>

          {isAuthenticated&&
            <Link 
              to="/auth/logout"
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
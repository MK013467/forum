import { Link, useNavigate } from 'react-router-dom'
import { FaUserLarge } from "react-icons/fa6";
import {api} from "../api";
import { useAuthStore } from 'src/store/useAuthStore';

const Headers = () => {
  const user = useAuthStore ((state) => state.user);
  const isLoggedIn = useAuthStore ((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      await api.post('/auth/logout');
      navigate("/");
    }
    catch(err:any){
      console.log(err.response?.msg);
    }
    finally{
      logout();
    }
  }

  return (<header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-gray-200 bg-white/90 backdrop-blur-md">
  <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8 lg:px-12">
    <Link
      to="/"
      className="bg-[url('/blog_forum_logo.svg')] bg-contain bg-no-repeat bg-left w-40 h-12 shrink-0"
    />

    <nav className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      {!isLoggedIn && (
        <Link
          to="/auth/signup"
          className="rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-blue-600"
        >
          Sign Up
        </Link>
      )}

      {!isLoggedIn && (
        <Link
          to="/auth/login"
          className="rounded-full bg-blue-500 px-5 py-2 text-white shadow-sm transition hover:bg-blue-600"
        >
          Login
        </Link>
      )}

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="rounded-full px-4 py-2 transition hover:bg-gray-100 hover:text-red-600"
        >
          Logout
        </button>
      )}
      {isLoggedIn && (
      <Link
        to={`/user/profile/${user?.id}`}
        className="ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <FaUserLarge className="h-5 w-5" />
      </Link>
      )}
    </nav>
  </div>
</header>
  );
};
export default Headers
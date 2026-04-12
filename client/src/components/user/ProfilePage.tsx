import { api } from '../../api'
import { FaUserLarge } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { PiSignOutDuotone } from "react-icons/pi";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from 'src/store/useAuthStore';
const ProfilePage = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const queryClient = useQueryClient();
    if(!user){
        navigate("/");
        return ;
    }


    async function handleDeleteAccount()  {
        try{
            setDeleting(true);
            await api.delete('/user/me');
            // Server side logout is already done by above code so we need to manually setUser to null
            logout();
            queryClient.removeQueries({ queryKey: ['posts'] });
            navigate("/");
        }
        catch(err){
            console.log(err);
        }
        finally{
            setDeleting(false);
            setShowDeleteModal(false);
        }
    }

    return (

        <div className='w-full min-h-screen p-10'>
            {/* Mobile */}
            <div className='w-full flex flex-col md:hidden items-center'>
                <div className='flex flex-col items-center gap-5 mb-5'>
                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center'>
                        <FaUserLarge className='w-16 h-16 text-gray-500'/>
                    </div>
                    <h1 className='text-lg font-medium'>{user.username}</h1>

                    <h1 className='bg-sky-200 text-blue-700 rounded-2xl font-medium px-4 py-2'>{user.email}</h1>

                </div>                   
                    <div className='w-full flex flex-col mt-20 gap-3'>
                    <div className="flex-grow border-b border-gray-400"></div>
                        <Link
                            to="/auth/change-password"
                            className='flex items-center bg-white rounded-2xl border border-gray-100 font-medium px-3 py-2'>
                            <FaUnlockKeyhole/>
                            <h1 className='pl-5'> Change Password</h1>
                        </Link>
                        <button 
                        onClick={()=> logout()}
                        className='flex items-center bg-white rounded-2xl border border-gray-100 font-medium px-3 py-2'>
                            <MdLogout className=''/>
                            <h1 className='pl-5'>Log out</h1>
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className='flex items-center bg-white rounded-2xl border border-gray-100 font-medium px-3 py-2'>
                            <PiSignOutDuotone className='text-red-500'/>
                            <h1 className='pl-5 text-red-500'>Delete Account</h1>
                        </button>
                        {showDeleteModal && (
                            <div className='fixed inset-0 items-center justify-center z-50 px-4 py-10 bg-black/30 border border-gray-200 rounded-2xl'>
                                <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-6">
                                    <h1 className='text-center font-medium text-xl'>Delete Account 😢</h1>
                                    <p className=''>This is a permanent and can not be done. Are you sure to delete your account?</p>
                                    <div className='flex justify-around mt-2'>
                                        <button 
                                            onClick={()=>handleDeleteAccount()}
                                            className='bg-red-500 text-white rounded-xl px-3 py-2'>
                                            Delete
                                        </button>
                                        <button 
                                            onClick={()=> setShowDeleteModal(false)}
                                            className='bg-gray-300 text-gray-500 rounded-xl px-3 py-2'>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                     </div>
            </div>

            {/* Desktop */}
            <div className='hidden md:flex max-w-6xl mx-auto gap-40 px-10 w-full'>
                {/* left */}
                <div className='flex flex-col shrink-0 justify-center items-center gap-5 border border-gray-300 rounded-2xl p-10'>
                    <div className='w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center'>
                        <FaUserLarge className='w-16 h-16 text-gray-600'/>
                    </div>
                    <h1 className='text-3xl font-bold'>{user.username}</h1>
                    <span className='text-xl'>Welcome back</span>
                    <h1 className='bg-sky-200 text-blue-700 text-xl rounded-2xl font-medium px-4 py-2'>{user.email}</h1>
                </div>

                {/* right */}
                <div className='flex-1 flex flex-col justify-center border border-gray-300 p-10'>

                    <div className='flex flex-col gap-3'>
                        <h1 className='font-bold text-2xl text-black'>Settings</h1>
                        <Link
                            to="/auth/change-password"
                            className='flex items-center bg-white rounded-2xl border border-gray-100 font-medium px-2 py-2'>
                            <FaUnlockKeyhole className='w-6 h-6'/>
                            <h1 className='pl-5 text-xl'> Change Password</h1>
                        </Link>
                        <button 
                        onClick={()=> logout()}
                        className='flex items-center bg-white rounded-2xl border border-gray-100 font-medium px-2 py-2'>
                            <MdLogout className='w-6 h-6'/>
                            <h1 className='pl-5 text-xl'>Log out</h1>
                        </button>
                    </div>
                    <div className='flex flex-col w-full pt-10'>
                        <h1 className='text-xl text-red-500 font-bold mb-5'>Danger Zone</h1>
                        <button
                                onClick={() => setShowDeleteModal(true)}
                                className='flex items-center bg-white rounded-2xl border border-gray-100 font-medium px-3 py-2'>
                                <PiSignOutDuotone className='w-6 h-6 text-red-500'/>
                                <h1 className='pl-5 text-red-500 text-xl'>Delete Account</h1>
                        </button>
                        {showDeleteModal && (
                            <div
                                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
                                onClick={() => setShowDeleteModal(false)}>
                                <div
                                    className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}>
                                <h1 className="text-center text-2xl font-bold text-gray-800">
                                    Delete Account 😢
                                </h1>
                                <p className="mt-4 text-center text-gray-600 leading-6">
                                    This is permanent and cannot be undone. Are you sure you want to delete your account?
                                </p>
                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white hover:bg-red-600">
                                    Delete
                                    </button>

                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="rounded-xl bg-gray-200 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-300">
                                    Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
                    
    )
}

export default ProfilePage
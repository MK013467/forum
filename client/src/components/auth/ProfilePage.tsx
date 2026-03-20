import { api } from '@shared/lib/api'
import React from 'react'
import { useAuth } from './AuthContext'

const ProfilePage = () => {

    const { user } = useAuth();

    const onSubmit =  async (e:any) =>{
        e.preventDefault();

        try{
            const connect = await api.post('/auth/profile');
            console.log(connect)
        }
        catch(err){
            console.log("error")
        }}

  return (
        <div>
            <h1>Hiii</h1>
            <form onSubmit={onSubmit}>
            <button type="submit" className="border border-red-200">
                aaa
            </button>
            </form>
        </div>
  )
}

export default ProfilePage
import  { useMemo, useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import { AuthContext } from './auth/AuthContext';
import { api } from '@shared/lib/api';


type User = {
  id:number;
  username:string;
  email:string
}


// The Parent Component
export const Layout = () => {
  const [user, setUser ] = useState<User|null>(null);
  const [loading , setLoading ] = useState(true);

  const refreshUser = async ()=>{
      try{
        const res = await api.get("/auth/me" );
        
        setUser(res.data);

      }
      catch(err){
        setUser(null);
        console.log(err)
      }
  }



  const logout = async () => {
    const res = api.post("/auth/logout");
    setUser(null);
    
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: !!user,
      refreshUser,
      logout,
    }),
    [user, loading]
  );


  return (

    <AuthContext.Provider value={value}>
    <div className='min-h-screen"'>
        <Header>
        </Header>
        <Outlet/>
    </div>
    // </AuthContext.Provider>
  )
}

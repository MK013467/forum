import { createContext } from 'react'

type User = {
    id:number;
    username:string;
    email:string
}

type AuthContextType = {
    user: User | null;
    isAuthenticated : boolean;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType|null>(null);


    

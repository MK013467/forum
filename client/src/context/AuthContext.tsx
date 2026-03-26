
import { api } from "@shared/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface User {
    id: number;
    email: string;
  }

  
interface AuthContextType{
    user: User| null;
    loading: boolean;
    refreshUser : () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null > (null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
//useEffect then backend fetch is required
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    const refreshUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    // return (
    //     <AuthContext.Provider value={{ user, loading, refreshUser }}>
    //       {children}
    //     </AuthContext.Provider>
    //   );
}

export const useAuth = () => {
    return useContext(AuthContext)!;
}
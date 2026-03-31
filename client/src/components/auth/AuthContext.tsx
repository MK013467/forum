import { api } from "../../api";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: number;
  username: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

type propType = {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: propType) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);  // 성공했을 때만
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  useEffect(() => {
    refreshUser(); 
  }, []);

  return ( 
    <AuthContext.Provider value={{ user , setUser, loading,  refreshUser, logout}} >
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthContext.Provider");
  }

  return context;
};
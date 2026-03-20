import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { AuthContext, type User } from "./auth/AuthContext";
import { api } from "@shared/lib/api";

export const Layout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser,
        logout,
      }}
    >
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <div className="h-20 lg:h-40 shrink-0" />
        <main className="flex-1 flex items-center justify-center mb-20">
          <Outlet />
        </main>
      </div>
    </AuthContext.Provider>
  );
};
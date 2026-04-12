import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuthStore } from "src/store/useAuthStore";

export const Layout = () => {
   return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <div className="h-20 lg:h-40 shrink-0" />
        <main className="flex-1 flex items-center justify-center mb-20">
          <Outlet />
        </main>
      </div>
  );
};
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuthStore } from "src/store/useAuthStore";
import { Suspense } from "react";
import { Loading } from "./Loading";

export const Layout = () => {
   return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <div className="h-20 lg:h-40 shrink-0" />
        <main className="flex-1 flex items-center justify-center mb-20">
          <Suspense fallback={<Loading/>}>
          <Outlet />
          </Suspense>
        </main>
      </div>
  );
};
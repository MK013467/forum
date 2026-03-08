import { createBrowserRouter } from "react-router-dom";
import PostsPage from "./components/post/PostsPage";
import OnePostPage from "./components/post/OnePostPage";
import CreatePostPage from "./components/post/CreatePostPage";
import LoginUserPage from "./components/auth/LoginUserPage";
import SignUpUser from "./components/auth/SignUpUserPage";
import UpdatePostPAge from "./components/post/UpdatePostPage";
import { Layout } from "./components/Layout";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import CheckVerificationCodePage from "./components/auth/CheckVerificationCodePage";

const router = createBrowserRouter([{
    element:<Layout/>,
    children:[
        {   
            path:"/",   
            element: <PostsPage/>,
    
        },
        {
            path:"/auth",
            children:[
                {
                    path:"reset-pass",
                    element:<ResetPasswordPage/>,
                },
                {
        
                    path:"checkvc",
                    element:<CheckVerificationCodePage/>
                },
                {
                    path:"login",
                    element:<LoginUserPage/>
                },
            
                {
                    path:"signup",
                    element:<SignUpUser/>
                }
            ]
        },
    
        {
            path:"/post",
            element:<PostsPage/>
        },
    
        {
            path:"/post/:id",
            element:<OnePostPage/>
        },
    
        {
            path:"/post/new",
            element:<CreatePostPage/>
        },
        {
            path:"/post/:id/edit",
            element:<UpdatePostPAge/>
        },
       
    ]
}])

export default router
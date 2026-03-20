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
import ProfilePage from "./components/auth/ProfilePage";
import ErrorTestPage from "./components/error/ErrorTestPage";
import RouteErrorPage from "./components/error/RouteErrorPage";

const router = createBrowserRouter([{
    element:<Layout/>,
    errorElement:<RouteErrorPage/>,
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
                },

                {
                    path:'profile',
                    element:<ProfilePage/>
                }
            ]
        },
    
        {
            path:"/post",
            element:<PostsPage/>
        },
    
        {
            path:"/post/:postId",
            element:<OnePostPage/>
        },
    
        {
            path:"/post/new",
            element:<CreatePostPage/>
        },
        {
            path:"/post/:id/edit",
            element:<UpdatePostPAge/>
        }
    ],
   
},
    {
        path:"/test/error",
        errorElement:<RouteErrorPage></RouteErrorPage>,
        element:<ErrorTestPage/>
    }
])

export default router
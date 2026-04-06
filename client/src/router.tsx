import { createBrowserRouter } from "react-router-dom";
import PostsPage from "./components/post/PostsPage";
import OnePostPage from "./components/post/OnePostPage";
import CreatePostPage from "./components/post/CreatePostPage";
import LoginUserPage from "./components/auth/LoginUserPage";
import SignUpUser from "./components/auth/SignUpUserPage";
import { Layout } from "./components/Layout";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import CheckVerificationCodePage from "./components/auth/CheckVerificationCodePage";
import ProfilePage from "./components/user/ProfilePage";
import ErrorTestPage from "./components/error/ErrorTestPage";
import RouteErrorPage from "./components/error/RouteErrorPage";
import ChangePasswordPage from "./components/auth/ChangePassword";

const router = createBrowserRouter([{
    element:<Layout/>,
    errorElement:<RouteErrorPage/>,
    children:[
        {   
            path:"/",   
            element: <PostsPage/>,
    
        },
        // auth
        {
            path:"/auth",
            children:[
                {
                    path:"reset-pass",
                    element:<ResetPasswordPage/>,
                },
                {
                    path:"change-password",
                    element:<ChangePasswordPage/>
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

        // for posts
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
        // profile
        {
            path:'/user/profile/:userid',
            element:<ProfilePage/>
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
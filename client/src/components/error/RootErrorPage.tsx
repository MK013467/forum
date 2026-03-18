import React from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

type RouteError = {
    status?: number,
    message?:string,
}

const RootErrorPage = () => {

    const error = useRouteError() as RouteError | null;

    if(isRouteErrorResponse(error)){
        return (
            <div className='w-full min-h-screen flex justify-center items-center'>
                <div className="w-64 h-64  bg-[url('/errorIcon.svg')] bg-cover bg-center mr-10">

                </div>
                {error.data}
            </div>
        )

        
    }
    return (
        <div className="w-full min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Unexpected Error</h1>
            <p className="mt-3 text-gray-600">Something went wrong.</p>
            <Link
              to="/"
              className="inline-block mt-6 rounded-xl bg-blue-500 px-5 py-3 text-white font-semibold"
            >
              Back to home
            </Link>
          </div>
        </div>
      );
}

export default RootErrorPage
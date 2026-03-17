import React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

type RouteError = {
    status?: number,
    message?:string,
}

const RootErrorPage = () => {

    const error = useRouteError() as RouteError | null;

    if(isRouteErrorResponse(error)){
        return (
            <div className='w-full min-h-screen flex justify-center items-center'>
                {error.data}
            </div>
        )
    }

  return (
    <div>RootErrorPage</div>
  )
}

export default RootErrorPage
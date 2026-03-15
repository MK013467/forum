import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const NotFoundPage = () => {
  const error = useRouteError();

  if(isRouteErrorResponse(error)){
    if(error.status = 404){
      return (
        <div>

        </div>
      )
    }

    if(error.status === 401){
      return (
        <div></div>
      )
    }


  }

  return (
    <div className="w-full max-w-3xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-3 text-gray-600">Failed to load this post.</p>
    </div>
  );
}

export default NotFoundPage;

import React from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { Link } from 'react-router-dom'


const RootErrorPage = ({error, resetErrorBoundary} : FallbackProps) => {
    console.log("Get instructed")
    return (
        
    <div className="w-full min-h-screen flex items-center justify-center px-6">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">Unexpected Error</h1>
      <p className="mt-3 text-gray-600">{'Something went wrong.'}</p>
      <button
        onClick={resetErrorBoundary}
        className="inline-block mt-6 rounded-xl bg-blue-500 px-5 py-3 text-white font-semibold"
      >
        Try again
      </button>
      <Link to="/" className="inline-block mt-3 text-blue-500 underline text-sm">
        Back to home
      </Link>
    </div>
  </div>
      );
}

export default RootErrorPage
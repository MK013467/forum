import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";


export const Loading = () => {
  return (
    <div className='flex items-center justify-center gap-5'>
        <h1 className='font-semibold text-lg'>Loading...</h1>
        <ClipLoader
        color="#36d7b7"
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"/>
    </div>
  )
}


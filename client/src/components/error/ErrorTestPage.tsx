import React from 'react'

const ErrorTestPage = () => {
    throw new Error("Data is missing!");
  return (
    <div>ErrorTestPage</div>
  )
}

export default ErrorTestPage
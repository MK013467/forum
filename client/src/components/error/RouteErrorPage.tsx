import { useRouteError } from "react-router-dom";

type RouteError = {
    status?: number,
    message?:string,
}

const RouteErrorPage = () => {
    const error = useRouteError() as RouteError | null;

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
    <div className="w-64 h-64  bg-[url('/errorIcon.svg')] bg-cover bg-center mr-10">

    </div>
    {error?.message}
</div>  )
}

export default RouteErrorPage
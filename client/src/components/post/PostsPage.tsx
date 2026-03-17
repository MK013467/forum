import { api } from '@shared/lib/api'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaChevronLeft , FaChevronRight} from 'react-icons/fa6';
import {  useQuery } from '@tanstack/react-query';
interface Post {
  id:number;
  title:string
  content:string
  createsAt:string
  views:number
  likes:number
  authorName:string
}
interface PostResponse{
  posts:Post[],
  totalPages:number,
  currentPage:number
}
const fetchPost =  async (page:number) => {
  const result = await api.get(`/post?page=${page}`);
  return result.data;
}

const PostsPage = () => {

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const {data:response, isLoading, isError, error} = useQuery<PostResponse>({
    queryKey:['posts',page],
    queryFn:()=>fetchPost(page),
    placeholderData: (previousData) => previousData
  });
  const navigate = useNavigate();
  const posts = response?.posts ?? [];
  const totalPages = response?.totalPages ?? 1;

  const toPrevPage = ()=>{
    navigate(`/post?page=${page + 1}`);
  }

  const toNextPage = ()=>{
    navigate(`/post?page=${page - 1}`);
  }

  const toSomePage = (page:number) => {
    navigate(`/post?page=${page}`)
  }

  
  // post.createdAt would be like "2026-03-02T13:51:14.420Z" with number of characters are fixed.
  const formatDate = (date:string) =>{
    return date.substring(5,10).replaceAll('-', ".");
  }


  //get posts from backend
  //postDetail 
  const handleClickRow = (postId:number)=> {
    navigate(`/post/${postId}`)    
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return <div>{error instanceof Error ? error.message : 'Failed to load posts'}</div>;
  }


  return ( 
    <div className='relative w-full'>
    <div className='flex absolute inset-0 bg-white justify-center items-center'>
      <div className='w-4/5 flex flex-col gap-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b-2 border-gray-100 bg-gray-100'>
            <th className='py-4 px-5 text-black font-medium'>title</th>
            <th className='py-4 px-5 text-black font-medium'>AuthorName</th>
            <th className='py-4 px-5 text-black font-medium'>PostedAt</th>
            <th className='py-4 px-5 text-black font-medium'>views</th>
            <th className='py-4 px-5 text-black font-medium'>likes</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 font-normal'>
          {posts.map((post)=>
          
            <tr key={post.id} onClick={()=> handleClickRow(post.id)} className='border-b-2 border-gray-100'>
              <th className='py-3 px-5 text-black font-normal w-1/2'>{post.title.length < 30? post.title:(post.title.substring(0,30)+'...') }</th>
              <th className='py-3 px-5 text-black font-normal'>{post.authorName}</th>
              <th className='py-3 px-5 text-black font-normal'>{formatDate(post.createsAt)} </th>
              <th className='py-3 px-5 text-black font-normal'>{post.views}</th>
              <th className='py-3 px-5 '>{post.likes}</th>
            </tr>
            
          )}
        </tbody>
      </table> 
      </div>
      {/* Pagination */}
      <div className='relative'>
        <div className='flex absolute left-1/2 -translate-x-1/2 gap-2 text-xl'>
          <button disabled={page===1}
            onClick={toPrevPage}
            className={`flex items-center gap-1 ${page!==1? 'text-black':'text-gray-500'}`}>
              <FaChevronLeft/> prev
          </button>
          {Array.from({length:totalPages - page+1}, (_,i) => page+i).map(
            page => (
            <button key={page}
            onClick={()=> toSomePage(page)}
            className={`text-base bg-white mx-1 ${page == page ? 'text-black':'text-gray-500'}`}>
                {page}
            </button>
            )
          )}
          <button disabled={page===totalPages}
            onClick={toNextPage}
            className={`flex items-center gap-1 ${totalPages === page? 'text-gray-500': 'text-black'}`}>
            next<FaChevronRight/>
          </button>
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default PostsPage;

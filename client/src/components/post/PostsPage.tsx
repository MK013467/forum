import { api } from '@shared/lib/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft , FaChevronRight} from 'react-icons/fa6';
interface Post {
  id:number;
  title:string
  content:string
  createsAt:string
  views:number
  likes:number
  authorName:number
}


const PostsPage = () => {

  const [posts, setPosts] = useState<Post[]> ([]);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toPrevPage = ()=>{
    // navigate(`?`)
  }

  const toNextPage = ()=>{

  }

  
  // post.createdAt would be like "2026-03-02T13:51:14.420Z" with number of characters are fixed.
  const formatDate = (date:string) =>{
    return date.substring(5,10).replaceAll('-', ".");
  }


  //get posts from backend
  useEffect( ()=>{
    const fetchData = async () =>{
      try{

        const res = await api.get(`/post?page=${currentPage}`);
        setPosts(res.data.postWithAuthor) ;
        setCurrentPage(res.data.currentPage);
        setTotalPages( res.data.totalPages);
      }
      catch(err){
        console.log(err);
      }

    };

    fetchData();

  },[currentPage,totalPages]);

  //postDetail 
  const handleClickRow = (postId:number)=> {
    navigate(`/post/${postId}`)    
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
          <button 
            onClick={toPrevPage}
            className={`flex items-center gap-1 ${currentPage!==1? 'text-black':'text-gray-500'}`}>
              <FaChevronLeft/> prev
          </button>
          {Array.from({length:totalPages - currentPage+1}, (_,i) => currentPage+i).map(
            page => (
            <button key={page}
            className={`text-base bg-white mx-1 ${page == currentPage ? 'text-black':'text-gray-500'}`}>
                {page}
            </button>
            )
          )}
          <button disabled={currentPage==1}
            onClick={toNextPage}
            className={`flex items-center gap-1 ${totalPages === currentPage? 'text-gray-500': 'text-black'}`}>
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

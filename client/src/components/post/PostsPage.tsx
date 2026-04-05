import { api } from '../../api'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface Post {
  id: number;
  title: string;
  content: string;
  createsAt: string;
  views: number;
  likes: number;
  authorName: string;
}

interface PostResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

interface PostRequest {
  page:number;
  searchBy?:string
  searchField?:string
}
const fetchPost = async ({ page, searchBy, searchField }: PostRequest) => {
  const params: Record<string, string | number> = { page };

  if (searchBy && searchField?.trim()) {
    params.searchBy = searchBy;
    params.searchField = searchField.trim();
  }
  try{
    const result = await api.get('/post', { params });
    return result.data;
  }
  catch(err){
  }
};

const formatDate = (date: string) => {
  return date.substring(5, 10).replaceAll('-', '.');
};

//Mobile item

const PostFeedItem = ({ post, onClick }: { post: Post; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="flex gap-3 px-3 py-3 border-b border-gray-100 active:bg-gray-50 cursor-pointer transition-colors overflow-x-hidden"
  >
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
        {post.title}
      </p>
      <span className="text-xs text-gray-400">
        {formatDate(post.createsAt)} · {post.authorName}
      </span>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>views {post.views}</span>
        <span>likes <strong className="text-red-500">{post.likes}</strong></span>
      </div>
    </div>
  </div>
);

//Shared pagination

const Pagination = ({
  page,
  totalPages,
  onPrev,
  onNext,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
}) => (
  <div className="flex justify-center items-center gap-1 py-4 border-t border-gray-100">
    <button
      disabled={page === 1}
      onClick={onPrev}
      className={`flex items-center gap-1 px-2 py-1 text-sm rounded ${
        page !== 1 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-default'
      }`}
    >
      <FaChevronLeft /> prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => onPage(p)}
        className={`w-8 h-8 text-sm rounded-full transition-colors ${
          p === page
            ? 'bg-gray-900 text-white font-medium'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        {p}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      onClick={onNext}
      className={`flex items-center gap-1 px-2 py-1 text-sm rounded ${
        page !== totalPages ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-default'
      }`}
    >
      next <FaChevronRight />
    </button>
  </div>
);

const PostsPage = () => {
  const {user} = useAuth();
  const [searchParams, setSearchParams] = useSearchParams(); // setSearchParams 
  const page = Number(searchParams.get('page') || 1);
  const searchBy = searchParams.get('searchBy') || '';
  const searchField = searchParams.get('searchField') || '';
  const [localSearchBy, setLocalSearchBy] = useState(searchBy || 'title');
  const [localSearchField, setLocalSearchField] = useState(searchField);

  const navigate = useNavigate();

  const { data: response, isLoading, isError, error} = useQuery<PostResponse>({
    queryKey: ['posts', page, searchBy, searchField],
    queryFn: () => fetchPost({page,searchBy,searchField}),
    placeholderData: (previousData) => previousData,
  });

  const posts = response?.posts ?? [];
  const totalPages = response?.totalPages ?? 1;
  const toPrevPage = () =>
    setSearchParams({ page: String(page - 1), searchBy, searchField });
  const toNextPage = () =>
    setSearchParams({ page: String(page + 1), searchBy, searchField });
  const toSomePage = (p: number) =>
    setSearchParams({ page: String(p), searchBy, searchField });

  const handleClickRow = (postId: number) => navigate(`/post/${postId}`);

  const handleSearch = () => {
    const trimmed = localSearchField.trim();
    if (!trimmed) {
      setSearchParams({ page: '1' });
      return;
    }
    
    setSearchParams({
      page: '1',
      searchBy: localSearchBy,
      searchField: localSearchField,
    });
  };

  // Enter key support
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-red-400">{error instanceof Error ? error.message : 'Failed to load posts'}</div>;

  const paginationProps = { page, totalPages, onPrev: toPrevPage, onNext: toNextPage, onPage: toSomePage };

  return (
    <div className="w-full min-h-screen bg-white">

      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        {user && (
          <div className="flex justify-end px-3 py-3">
            <button
              type="button"
              onClick={() => navigate("/post/new")}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-800"
            >
              Create Post
            </button>
          </div>
        )}
        {posts.map((post) => (
          <PostFeedItem key={post.id} post={post} onClick={() => handleClickRow(post.id)} />
        ))}
        <Pagination {...paginationProps} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex justify-center items-start py-10 px-8">
        <div className="w-4/5 flex flex-col gap-4 relative">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* table */}
            <table 
            className="w-full text-sm">

              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-100">
                  <th className="text-left py-2 px-5 text-black font-medium">Title</th>
                  <th className="text-left py-2 px-5 text-black font-medium">Author</th>
                  <th className="text-left py-2 px-5 text-black font-medium">Posted At</th>
                  <th className="text-left py-2 px-5 text-black font-medium">Views</th>
                  <th className="text-left py-2 px-5 text-black font-medium">Likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => handleClickRow(post.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-5 text-gray-900 w-1/2">
                      {post.title.length < 50 ? post.title : post.title.substring(0, 50) + '...'}
                    </td>
                    <td className="py-1 px-5 text-sm text-gray-600">{post.authorName}</td>
                    <td className="py-1 px-5 text-sm text-gray-600">{formatDate(post.createsAt)}</td>
                    <td className="py-1 px-5 text-sm text-gray-600">{post.views}</td>
                    <td className="py-1 px-5 text-sm text-gray-600">{post.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex justify-center items-center'>


            <select 
              name="searchBy"
              value={localSearchBy}
              onChange={(e)=>setLocalSearchBy(e.target.value)}
              className='pr-2'>
            <option value="title">title</option>
            <option value="content">content</option>
            <option value="username">username</option>
            </select>

            <input 
              className=''
              value={localSearchField}
              onChange={(e)=>setLocalSearchField(e.target.value)}
              onKeyDown={handleEnterKeyDown}/>
              <button type='button'
                onClick={handleSearch}
                >
                <CiSearch/>
              </button>

              {user&&
               (<button
                type="button"
                onClick={() => navigate("/post/new")}
                className="px-4 py-2 absolute right-0 bottom-4 rounded-lg bg-blue-500 text-white hover:bg-blue-800 ml-10"
              >
              Create Post
              </button>)}
          </div>
          <Pagination {...paginationProps} />
        </div>
      </div>
    </div>
  );
};

export default PostsPage;

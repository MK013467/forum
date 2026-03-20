import { api } from '@shared/lib/api'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';

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

const fetchPost = async (page: number) => {
  const result = await api.get(`/post?page=${page}`);
  return result.data;
};

const formatDate = (date: string) => {
  return date.substring(5, 10).replaceAll('-', '.');
};

// ── Mobile feed item ─────────────────────────────────────────────────────────

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
        <span>조회 {post.views}</span>
        <span>추천 <strong className="text-red-500">{post.likes}</strong></span>
      </div>
    </div>
  </div>
);

// ── Shared pagination ────────────────────────────────────────────────────────

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

// ── Main page ────────────────────────────────────────────────────────────────

const PostsPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const navigate = useNavigate();

  const { data: response, isLoading, isError, error } = useQuery<PostResponse>({
    queryKey: ['posts', page],
    queryFn: () => fetchPost(page),
    placeholderData: (previousData) => previousData,
  });

  const posts = response?.posts ?? [];
  const totalPages = response?.totalPages ?? 1;

  const toPrevPage = () => navigate(`/post?page=${page - 1}`);
  const toNextPage = () => navigate(`/post?page=${page + 1}`);
  const toSomePage = (p: number) => navigate(`/post?page=${p}`);
  const handleClickRow = (postId: number) => navigate(`/post/${postId}`);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-red-400">{error instanceof Error ? error.message : 'Failed to load posts'}</div>;

  const paginationProps = { page, totalPages, onPrev: toPrevPage, onNext: toNextPage, onPage: toSomePage };

  return (
    <div className="w-full min-h-screen bg-white">

      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        {posts.map((post) => (
          <PostFeedItem key={post.id} post={post} onClick={() => handleClickRow(post.id)} />
        ))}
        <Pagination {...paginationProps} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex justify-center items-start py-10 px-8">
        <div className="w-4/5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-100">
                  <th className="py-4 px-5 text-black font-medium">Title</th>
                  <th className="py-4 px-5 text-black font-medium">Author</th>
                  <th className="py-4 px-5 text-black font-medium">Posted At</th>
                  <th className="py-4 px-5 text-black font-medium">Views</th>
                  <th className="py-4 px-5 text-black font-medium">Likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => handleClickRow(post.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-5 text-gray-900 w-1/2">
                      {post.title.length < 50 ? post.title : post.title.substring(0, 50) + '...'}
                    </td>
                    <td className="py-3 px-5 text-gray-600">{post.authorName}</td>
                    <td className="py-3 px-5 text-gray-600">{formatDate(post.createsAt)}</td>
                    <td className="py-3 px-5 text-gray-600">{post.views}</td>
                    <td className="py-3 px-5 text-gray-600">{post.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination {...paginationProps} />
        </div>
      </div>

    </div>
  );
};

export default PostsPage;

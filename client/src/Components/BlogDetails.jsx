import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeft, FiClock, FiShare2 } from "react-icons/fi";
import { format } from "date-fns";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [blogRes, relatedRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/visitor-blogs/${id}`),
          axios.get(`http://localhost:8000/api/visitor-blogs?limit=3`)
        ]);
        setBlog(blogRes.data);
        setRelatedBlogs(relatedRes.data.filter(b => b._id !== id));
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content.slice(0, 100),
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h2>
      <button 
        onClick={() => navigate('/blogs')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Browse all blogs
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <FiArrowLeft className="mr-2" />
        Back to blogs
      </button>

      <article className="bg-white rounded-xl shadow-sm overflow-hidden">
        {blog.image && (
          <div className="relative h-96 w-full">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="mr-1" />
              {blog.createdAt && format(new Date(blog.createdAt), 'MMMM d, yyyy')}
            </div>
            <button 
              onClick={shareBlog}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
              aria-label="Share this blog"
            >
              <FiShare2 />
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h1>
          
          <div className="prose max-w-none text-gray-700 mb-8">
            {blog.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {blog.whatToCarry && (
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-800 mb-3">What to carry:</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(blog.whatToCarry) ? (
                  blog.whatToCarry.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {blog.whatToCarry}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </article>

      {relatedBlogs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More stories you might like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map(blog => (
              <div 
                key={blog._id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                {blog.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{blog.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{blog.content.slice(0, 100)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetails;
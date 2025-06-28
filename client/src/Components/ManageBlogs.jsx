import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiUpload, FiLoader } from "react-icons/fi";

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    content: "", 
    whatToCarry: "", 
    image: null,
    imagePreview: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8000/api/visitor-blogs");
      setBlogs(res.data);
    } catch (err) {
      toast.error("Failed to fetch blogs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    data.append("whatToCarry", JSON.stringify(
      form.whatToCarry.split(",").map(item => item.trim())
    ));
    if (form.image) data.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/visitor-blogs/${editingId}`, data);
        toast.success("Blog updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/visitor-blogs", data);
        toast.success("Blog created successfully!");
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save blog");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:8000/api/visitor-blogs/${id}`);
        toast.success("Blog deleted successfully!");
        fetchBlogs();
      } catch (err) {
        toast.error("Failed to delete blog");
        console.error(err);
      }
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      whatToCarry: Array.isArray(blog.whatToCarry) ? 
        blog.whatToCarry.join(", ") : 
        blog.whatToCarry,
      image: null,
      imagePreview: blog.image || null
    });
    setEditingId(blog._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ 
      title: "", 
      content: "", 
      whatToCarry: "", 
      image: null,
      imagePreview: null 
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Visitor Blog Management</h1>
        <p className="text-gray-600">Create and manage visitor blog posts</p>
      </div>

      {/* Blog Form */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
        <div className="p-6 bg-gradient-to-r from-green-600 to-green-500">
          <h2 className="text-xl font-semibold text-white">
            {editingId ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter blog title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your blog content here..."
              rows="6"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What to Carry</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma separated list of items"
              value={form.whatToCarry}
              onChange={(e) => setForm({ ...form, whatToCarry: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">Example: Water bottle, Snacks, Camera, Hiking shoes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="p-4 text-center">
                  <FiUpload className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-1">
                    {form.image ? form.image.name : "Click to upload image"}
                  </p>
                </div>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </label>
              {form.imagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={form.imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg shadow-md transition-all ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  {editingId ? "Updating..." : "Posting..."}
                </>
              ) : (
                editingId ? "Update Blog" : "Publish Blog"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Blog Posts</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No blog posts found. Create your first blog!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {blog.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.content}</p>
                  
                  {blog.whatToCarry && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">What to Carry:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(blog.whatToCarry) ? (
                          blog.whatToCarry.map((item, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {blog.whatToCarry}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlog;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PopularTrek = () => {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status
    
    const fetchTreks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/places");
        if (isMounted) {
          setTreks(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch treks", err);
        if (isMounted) {
          setError("Failed to load treks. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTreks();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  const generateSlug = (title, id) => {
    return `${title?.toLowerCase()?.replace(/\s+/g, "-")}-${id}`;
  };

  const handleReadMore = (title, id) => {
    const slug = generateSlug(title, id);
    navigate(`/trek/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl text-center mb-8 text-gray-800 uppercase tracking-wider font-bold">
          POPULAR TREKS
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl text-center mb-8 text-gray-800 uppercase tracking-wider font-bold">
          POPULAR TREKS
        </h2>
        <div className="text-center text-red-500 py-8">{error}</div>
      </section>
    );
  }

  if (treks.length === 0) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl text-center mb-8 text-gray-800 uppercase tracking-wider font-bold">
          POPULAR TREKS
        </h2>
        <div className="text-center text-gray-500 py-8">No treks available at the moment.</div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl text-center mb-8 text-gray-800 uppercase tracking-wider font-bold">
        POPULAR TREKS
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {treks.map((trek) => (
          <div 
            key={trek._id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            <img 
              src={trek.image || '/placeholder-trek.jpg'} 
              alt={trek.title || 'Trek image'} 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder-trek.jpg';
              }}
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-blue-500 mb-2 text-center border-b border-gray-200 pb-2">
                {trek.title || 'Untitled Trek'}
              </h3>
              <p className="text-gray-500 mb-4 text-center border-b border-gray-200 pb-3">
                {trek.location || 'Location not specified'}
              </p>
              <p className="text-gray-700 leading-relaxed text-sm mb-6 flex-grow">
                {trek.description?.slice(0, 120) || 'No description available'}...
              </p>
              <div className="text-center mt-auto">
                <button 
                  onClick={() => handleReadMore(trek.title, trek._id)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularTrek;
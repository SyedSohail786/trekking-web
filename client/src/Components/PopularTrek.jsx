import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PopularTrek = () => {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/places");
        setTreks(res.data);
      } catch (err) {
        console.error("Failed to fetch treks", err);
      }
    };
    fetchTreks();
  }, []);

  const handleReadMore = (trekId) => {
    navigate(`/trek/${trekId}`);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl text-center mb-8 text-gray-800 uppercase tracking-wider font-bold">
        POPULAR TREK
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {treks.map((trek) => (
          <div 
            key={trek._id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full"
          >
            <img 
              src={trek.image} 
              alt={trek.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-blue-500 mb-2 text-center border-b border-gray-200 pb-2">
                {trek.title}
              </h3>
              <p className="text-gray-500 mb-4 text-center border-b border-gray-200 pb-3">
                {trek.location}
              </p>
              <p className="text-gray-700 leading-relaxed text-sm mb-6 flex-grow">
                {trek.description?.slice(0, 120)}...
              </p>
              <div className="text-center mt-auto">
                <button 
                  onClick={() => handleReadMore(trek._id)}
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

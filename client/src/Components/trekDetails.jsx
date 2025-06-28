import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrekDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTrek = async () => {
      try {
        setLoading(true);
        const id = slug.split('-').pop();
        const res = await axios.get(`http://localhost:8000/api/places/${id}`);
        if (isMounted) {
          setTrek(res.data);
          // Set first image as selected by default
          if (res.data.gallery?.length > 0) {
            setSelectedImage(res.data.gallery[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch trek", err);
        if (isMounted) {
          setError("Failed to load trek details. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrek();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        Trek not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-blue-500 hover:text-blue-700"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Treks
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 w-full">
          <img 
            src={selectedImage || trek.image || '/placeholder-trek.jpg'} 
            alt={trek.title || 'Trek image'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/placeholder-trek.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div>
              <h1 className="text-4xl font-bold text-white">{trek.title || 'Untitled Trek'}</h1>
              <p className="text-xl text-gray-200 mt-2">{trek.location || 'Location not specified'}</p>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {trek.gallery?.length > 0 && (
          <div className="p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Gallery</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {trek.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === image ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-trek.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About the Trek</h2>
            <p className="text-gray-700 mb-6">{trek.description || 'No description available'}</p>
            
            {(trek.fullDetails?.length > 0) && (
              <div className="space-y-4">
                {trek.fullDetails.map((detail, index) => (
                  <p key={index} className="text-gray-700">{detail}</p>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          {(trek.stats?.length > 0) && (
            <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trek Details</h3>
              <div className="space-y-4">
                {trek.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-medium">{stat.label || 'Detail'}</span>
                    <span className="text-gray-800">{stat.value || 'Not specified'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrekDetail;
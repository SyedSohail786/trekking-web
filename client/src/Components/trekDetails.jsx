import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrekDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/places/${id}`);
        setTrek(res.data);
      } catch (err) {
        console.error("Failed to fetch trek details", err);
      }
    };
    fetchTrek();
  }, [id]);

  if (!trek) return <div className="text-center py-20">Trek not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-blue-500 hover:text-blue-700">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Treks
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 w-full">
          <img src={trek.image} alt={trek.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div>
              <h1 className="text-4xl font-bold text-white">{trek.title}</h1>
              <p className="text-xl text-gray-200 mt-2">{trek.location}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About the Trek</h2>
            <p className="text-gray-700 mb-6">{trek.description}</p>
            <div className="space-y-4">
              {trek.fullDetails.map((detail, index) => (
                <p key={index} className="text-gray-700">{detail}</p>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {
            trek.stats && (
              <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Trek Details</h3>
                <div className="space-y-4">
                  {trek.stats.map((stat, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span className="text-gray-600 font-medium">{stat.label}</span>
                      <span className="text-gray-800">{stat.value}</span>
                    </div>
                  ))}
                </div>
                {/* <button className="mt-8 w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
                  Book This Trek
                </button> */}
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default TrekDetail;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const trekData = {
  1: {
    title: "Brahmagiri Trek",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    location: "Kodagu, Karnataka",
    description: "The Brahmagiri Trek is a breathtaking journey through the Western Ghats of Karnataka. This 24 km trek starts from the Iruppu Falls and takes you through dense Shola forests, sprawling grasslands, and offers panoramic views of the surrounding valleys.",
    fullDetails: [
      `The trek is moderately challenging with an elevation gain of about 1600m.
      You'll encounter diverse flora and fauna, including rare bird species and butterflies.
      The highlight is reaching the Brahmagiri Peak at 1608m, where you can see the border between Karnataka and Kerala.
      The trail passes through the Brahmagiri Wildlife Sanctuary, home to elephants, deer, and other wildlife.
      Camping is available near the peak with prior permission from forest authorities.`
    ],
    stats: [
      { label: "Difficulty", value: "Moderate" },
      { label: "Duration", value: "2 Days" },
      { label: "Best Season", value: "October to March" },
      { label: "Elevation", value: "1608 meters" },
      { label: "Trek Length", value: "24 km (round trip)" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1470114716159-e389f8712fda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ]
  },
  // Add other trek details similarly...
};

const TrekDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trek = trekData[id];

  if (!trek) {
    return <div className="text-center py-20">Trek not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            src={trek.image} 
            alt={trek.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div>
              <h1 className="text-4xl font-bold text-white">{trek.title}</h1>
              <p className="text-xl text-gray-200 mt-2">{trek.location}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About the Trek</h2>
            <p className="text-gray-700 mb-6">{trek.description}</p>
            
            <div className="space-y-4">
              {trek.fullDetails.map((detail, index) => (
                <p key={index} className="text-gray-700">{detail}</p>
              ))}
            </div>

            {/* Gallery */}
            <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trek.gallery.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`${trek.title} view ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Sidebar with Stats */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trek Details</h3>
            <div className="space-y-4">
              {trek.stats.map((stat, index) => (
                <div key={index} className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-medium">{stat.label}</span>
                  <span className="text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-300">
              Book This Trek
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrekDetail;
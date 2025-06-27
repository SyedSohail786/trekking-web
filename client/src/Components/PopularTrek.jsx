import React from 'react';
import { useNavigate } from 'react-router-dom';

const PopularTrek = () => {
  const navigate = useNavigate();
  const treks = [
    {
      id: 1,
      title: "Brahmagiri",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      location: "Kodagu",
      shortDescription: "In the lap of nature, this scenic 24 km trek passes through the brednii taking input Falls, Shola Forests and Grasslands.",
      fullDescription: "The Brahmagiri Trek is a breathtaking journey through the Western Ghats of Karnataka. This 24 km trek starts from the Iruppu Falls and takes you through dense Shola forests, sprawling grasslands, and offers panoramic views of the surrounding valleys. The trek is moderately challenging with an elevation gain of about 1600m. You'll encounter diverse flora and fauna, including rare bird species and butterflies. The highlight is reaching the Brahmagiri Peak at 1608m, where you can see the border between Karnataka and Kerala. The best time to visit is between October and March when the weather is pleasant and the landscapes are lush green.",
      difficulty: "Moderate",
      duration: "2 Days",
      bestSeason: "October to March",
      elevation: "1608 meters",
      highlights: "Iruppu Falls, Shola Forests, Panoramic Views"
    },
    // Other treks with similar expanded data...
  ];

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
            key={trek.id} 
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
                {trek.shortDescription}
              </p>
              <div className="text-center mt-auto">
                <button 
                  onClick={() => handleReadMore(trek.id)}
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = () => {
  // High-quality nature images from Unsplash
  const images = [
    {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Misty forest in Karnataka"
    },
    {
      url: "https://aranyavihaara.karnataka.gov.in/images/b3.png",
      alt: "Forest trail in Western Ghats"
    },
    {
      url: "https://aranyavihaara.karnataka.gov.in/images/b1.png",
      alt: "Waterfall in Karnataka forest"
    },
    {
      url: "https://aranyavihaara.karnataka.gov.in/images/b5.png",
      alt: "Waterfall in Karnataka forest"
    },
    {
      url: "https://aranyavihaara.karnataka.gov.in/images/b6.png",
      alt: "Waterfall in Karnataka forest"
    },

  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    fade: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    cssEase: 'linear'
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Fallback background in case images don't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-700 z-0"></div>
      
      <Slider {...settings}>
        {images.map((image, idx) => (
          <div key={idx} className="relative h-[70vh] w-full">
            {/* Image with proper loading and error handling */}
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Overlay text */}
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
              <div className="text-center px-4">
                <h2 className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  Explore Karnataka's Wilderness
                </h2>
                <p className="text-lg md:text-xl text-white max-w-2xl mx-auto drop-shadow-md">
                  Discover pristine forests and breathtaking trails with Aranya Vihaara
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
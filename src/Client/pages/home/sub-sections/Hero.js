// src/components/Hero.js
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom"; 

const slides = [
  {
    image: "/Untitled_design_8_6aa975e1-d185-4629-9d4a-a40d55aedb48.png",
    title: "Effortlessly Stylish",
    description: "Don't miss out on our hottest discounts for the hottest season!",
    button: "Shop Now",
    category: "shirt", 
  },
  {
    image: "/summercamp.png",
    title: "summer special",
    description: "Nothing does laid-back cool like streetwear fashion",
    button: "Explore Now",
    category: "cap",
  },
  {
    image: "/84770f_0d208e6107cc4d64a2fd2d910a578fb2~mv2.avif",
    title: "BLUSH & LUSH",
    description: "Find your favorite heroes and vintage stories.",
    button: "Discover",
    category: "comics",
  },
];

export default function Hero() {
  const swiperRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const navigate = useNavigate(); // 
  const togglePlay = () => {
    if (!swiperRef.current) return;
    if (playing) swiperRef.current.autoplay.stop();
    else swiperRef.current.autoplay.start();
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        className="z-20 absolute bottom-5 right-5 bg-white/80 text-black rounded-full p-3 shadow-lg hover:scale-110 transition"
      >
        {playing ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>

     
      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={(s) => (swiperRef.current = s)}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
             
              <div className="absolute inset-0 bg-black/40"></div>

            
              <div className="relative z-10 max-w-4xl px-6 md:px-12 h-full flex flex-col justify-center text-left">
                <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl text-orange-300 mt-4 drop-shadow">
                  {slide.description}
                </p>
                <button
                  onClick={() => navigate(`/products?category=${slide.category}`)} 
                  className="mt-6 bg-gray-500 text-black px-8 py-3 rounded-full text-lg font-semibold shadow hover:scale-105 transition"
                >
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// src/components/Hero.js
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const slides = [
  {
    image: 'https://www.shutterstock.com/shutterstock/photos/2504555377/display_1500/stock-photo-rear-view-of-happy-indian-young-woman-in-wireless-headphones-dancing-listening-favorite-energetic-2504555377.jpg',
    title: 'Build an elite collection',
    description: 'Choose your next adventure from thousands of finds.',
    button: 'Start your journey',
    tag: 'Lego',
  },
  {
    image: 'https://media.gettyimages.com/id/637945020/photo/woman-running-with-shopping-cart-in-supermarket-produce-aisle.jpg?s=612x612&w=gi&k=20&c=RY4U3sAhHzY684lTvRBcI2EeEtW30rWRuKw0lX9xpTU=',
    title: 'Collect Rare Coins',
    description: 'Explore historic treasures and unique currencies.',
    button: 'Start your journey',
    tag: 'Coins',
  },
  {
    image: 'https://framerusercontent.com/images/inF3xDJJojLEbyCQ5fqIi38cGY.png',
    title: 'Comic Book Legends',
    description: 'Find your favorite heroes and vintage stories.',
    button: 'Start your journey',
    tag: 'Comic books',
  },
];

export default function Hero() {
  const swiperRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    if (!swiperRef.current) return;
    if (playing) swiperRef.current.autoplay.stop();
    else swiperRef.current.autoplay.start();
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full h-[85vh] bg-gray-200 flex items-center justify-center overflow-hidden">
      {/* Play / Pause Button */}
      <button
        onClick={togglePlay}
        className="z-10 absolute bottom-5 right-5 bg-white text-black rounded-full p-3 shadow hover:scale-110 transition"
      >
        {playing ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={(s) => (swiperRef.current = s)}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="max-w-7xl mx-auto h-full px-5 py-10 grid grid-cols-1 md:grid-cols-2 items-center">
              {/* Text Section */}
              <div className="text-left space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#4E1609]">
                  {slide.title}
                </h2>
                <p className="text-[#6E2C13] text-lg">{slide.description}</p>
                <button className="bg-[#4E1609] text-white px-6 py-2 rounded-full hover:brightness-110 transition">
                  {slide.button}
                </button>
              </div>

              {/* Image Section */}
              <div className="flex justify-center">
                <img
                  src={slide.image}
                  alt={slide.tag}
                  className="h-60 md:h-72 rounded-xl shadow-lg"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
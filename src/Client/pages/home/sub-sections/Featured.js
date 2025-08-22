// src/components/FeaturedCarousel.jsx
import {
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseUrl } from '../../../../environment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const icons = [
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
];

export default function FeaturedCarousel() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/products`);
      setProducts(res.data.products); // Show all products
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="relative isolate bg-gray-50 dark:bg-slate-900 py-24 sm:py-32">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_70%)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
          Featured Products
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Best suggested recent products
        </p>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1000} // ✅ Smooth transition duration
          loop={true}
          navigation
          className="mt-14"
        >
          {products.map((product, i) => {
            const Icon = icons[i % icons.length]; // Rotate icons
            return (
              <SwiperSlide key={product._id}>
                <a
                  href={`/products#${product._id}`}
                  className="group relative flex flex-col h-full rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-xl transition-all duration-300 hover:-translate-y-2 hover:brightness-110 overflow-hidden"
                >
                  {/* Background halo */}
                  <span className="pointer-events-none absolute inset-0 -z-10 before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br from-indigo-400 to-purple-600 before:blur-xl before:opacity-40" />

                  <div className="px-8 pt-10 pb-6 sm:px-10 sm:pt-12 flex flex-col gap-3 flex-grow">
                    {Icon && <Icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {product.short_des || product.description}
                    </p>
                  </div>

                  <div className="relative mt-auto flex justify-center items-center p-8 sm:p-10 min-h-[200px]">
                    <img
                      src={
                        product.images?.[0]
                          ? `${baseUrl}/uploads/${product.images[0]}`
                          : "https://placehold.co/300x300?text=No+Image"
                      }
                      alt={product.title}
                      className="h-52 w-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
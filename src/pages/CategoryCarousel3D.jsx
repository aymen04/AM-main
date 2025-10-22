import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bracelet from '../assets/bracelet.jpeg';
import ring from '../assets/ring.jpeg';
import earing from '../assets/earring.jpeg';
import necklace from '../assets/necklace.jpeg';
import pendant from '../assets/pendant.jpeg';

export default function CategoryCarousel3D() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const categories = [
    {
      id: 1,
      name: 'Colliers',
      slug: 'Collier',
      image: necklace,
      description: 'Élégance autour du cou'
    },
    {
      id: 2,
      name: 'Bracelets',
      slug: 'Bracelet',
      image: bracelet,
      description: 'Sublimez vos poignets'
    },
    {
      id: 3,
      name: 'Bagues',
      slug: 'Bague',
      image: ring,
      description: 'Bijoux de caractère'
    },
    {
      id: 4,
      name: 'Boucles d\'oreilles',
      slug: 'Boucles d\'oreilles',
      image: earing,
      description: 'Lumière et raffinement'
    },
    {
      id: 5,
      name: 'Pendentifs',
      slug: 'Pendentif',
      image: pendant,
      description: 'Grâce et spiritualité'
    }
  ];

  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating, categories.length]);

  const getCardStyle = (index) => {
    const position = (index - currentIndex + categories.length) % categories.length;
    const totalCards = categories.length;
    
    const angle = (position / totalCards) * Math.PI * 2;
    const radius = window.innerWidth < 768 ? 180 : window.innerWidth < 1024 ? 220 : 280;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const rotateY = (angle * 180) / Math.PI;
    
    const isCurrent = position === 0;
    const opacity = isCurrent ? 1 : position === 1 || position === totalCards - 1 ? 0.5 : 0.2;
    const scale = isCurrent ? 1.2 : position === 1 || position === totalCards - 1 ? 0.85 : 0.6;
    
    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: isCurrent ? 10 : 5 - Math.abs(position - 2)
    };
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setIsAutoRotating(false);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    setIsAutoRotating(false);
  };

  const handleCardClick = (category, isCurrent) => {
    if (isCurrent) {
      navigate(`/boutique?category=${category.slug}`);
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#ebc280]/10 via-transparent to-transparent opacity-30"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-widest text-[#ebc280] mb-4 md:mb-6">
            MAGASINER PAR CATÉGORIE
          </h2>
          <p className="text-gray-400 text-base md:text-lg tracking-wide">
            Explorez notre collection par type de bijou
          </p>
        </div>

        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
          <div
            className="relative w-full h-full"
            style={{ perspective: '800px' }}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {categories.map((category, index) => {
                const position = (index - currentIndex + categories.length) % categories.length;
                const isCurrent = position === 0;
                
                return (
                  <div
                    key={category.id}
                    className="absolute transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      ...getCardStyle(index),
                      transformStyle: 'preserve-3d',
                      pointerEvents: isCurrent ? 'auto' : 'none'
                    }}
                    onClick={() => handleCardClick(category, isCurrent)}
                  >
                    <div className="relative w-[280px] md:w-[320px] lg:w-[380px] h-[360px] md:h-[420px] lg:h-[480px] group">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-[#ebc280]/20 bg-zinc-900">
                        <div className="absolute inset-0">
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8">
                          <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                            <p className="text-[#ebc280] text-xs md:text-sm tracking-widest mb-2 uppercase">
                              {category.count}
                            </p>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-white mb-2 md:mb-3">
                              {category.name}
                            </h3>
                            <p className="text-gray-300 text-xs md:text-sm mb-4 md:mb-6 tracking-wide">
                              {category.description}
                            </p>
                            
                            {isCurrent && (
                              <button className="inline-block px-6 md:px-8 py-2 md:py-3 border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 tracking-widest text-xs opacity-0 group-hover:opacity-100 min-h-[44px] flex items-center">
                                DÉCOUVRIR
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ebc280]/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-[90%] h-8 bg-[#ebc280]/20 blur-2xl rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-2 md:left-4 lg:left-12 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-black/30 min-h-[44px]"
          >
            <ChevronLeft size={20} md:size={28} />
          </button>

          <button
            onClick={next}
            className="absolute right-2 md:right-4 lg:right-12 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-black/30 min-h-[44px]"
          >
            <ChevronRight size={20} md:size={28} />
          </button>
        </div>

        <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-12">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoRotating(false);
              }}
              className={`transition-all duration-300 rounded-full min-h-[44px] flex items-center ${
                index === currentIndex
                  ? 'w-8 md:w-12 h-2 md:h-3 bg-[#ebc280]'
                  : 'w-2 md:w-3 h-2 md:h-3 bg-[#ebc280]/30 hover:bg-[#ebc280]/60'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-500 text-xs md:text-sm tracking-wide">
            {isAutoRotating ? '⟳ Rotation automatique' : 'Pause - Survolez pour explorer'}
          </p>
        </div>
      </div>
    </section>
  );
}
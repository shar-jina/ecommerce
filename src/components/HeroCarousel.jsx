import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroCarousel = ({ offers }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (offers.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [offers.length]);

    if (!offers || offers.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
    };

    return (
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden bg-transparent group">
            {/* Slides container */}
            <div 
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {offers.map((offer, index) => (
                    <div 
                        key={offer.id || index} 
                        className="min-w-full h-full p-4 md:p-6"
                        onClick={() => {
                            if (offer.product_id) {
                                navigate(`/product/${offer.product_id}`);
                            } else {
                                navigate('/productdetail', { state: { query: offer.title } });
                            }
                        }}
                    >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                            {/* Curved & Padded Image Container */}
                            <div className="absolute inset-0 z-0 p-4 md:p-8">
                                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                    <img 
                                        src={offer.image} 
                                        alt={offer.title} 
                                        className="w-full h-full object-cover opacity-80 transition-transform duration-[3s] group-hover:scale-110"
                                    />
                                    {/* Subtle Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal/80 via-teal/30 to-transparent"></div>
                                </div>
                            </div>

                            {/* Text Overlay Content */}
                            <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-20 text-white">
                                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-[0.2em] uppercase bg-orange rounded-lg shadow-lg self-start">
                                    {offer.discount_label || 'Exclusive Deal'}
                                </span>
                                <h2 className="text-display mb-4 leading-tight drop-shadow-xl uppercase max-w-lg">
                                    {offer.title}
                                </h2>
                                <p className="hidden md:block text-body text-white/70 mb-8 max-w-md leading-relaxed line-clamp-2">
                                    {offer.content || offer.description}
                                </p>
                                <div className="inline-block bg-white text-teal px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange hover:text-white transition-all shadow-xl active:scale-95 self-start">
                                    Discover Now
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {offers.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Indicators / Dots */}
            {offers.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {offers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                currentIndex === index ? 'bg-blue-500 w-8' : 'bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroCarousel;

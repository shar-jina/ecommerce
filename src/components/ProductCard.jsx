import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isWishlisted = isInWishlist(product.id);

    const images = product.images && product.images.length > 0 
        ? product.images 
        : (product.image ? [product.image] : ['https://via.placeholder.com/300?text=No+Image']);

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="group relative flex flex-col h-full animate-fade-in bg-white rounded-retail shadow-retail hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                </Link>

                {/* Floating Action Icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${isWishlisted ? 'bg-orange text-white' : 'bg-white text-gray-400 hover:text-orange'}`}
                    >
                        <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="w-9 h-9 bg-white text-gray-400 hover:text-teal rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button 
                            onClick={prevImage}
                            className="p-2 bg-white/80 backdrop-blur-sm text-teal rounded-full hover:bg-orange hover:text-white transition-colors pointer-events-auto shadow-sm"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={nextImage}
                            className="p-2 bg-white/80 backdrop-blur-sm text-teal rounded-full hover:bg-orange hover:text-white transition-colors pointer-events-auto shadow-sm"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <Link to={`/product/${product.id}`} className="flex-1">
                        <h3 className="text-sm font-bold text-onyx hover:text-teal transition-colors line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    <span className="text-sm font-black text-teal">
                        ₹{product.price}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-orange">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">(4.8)</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">SKU: 00{product.id}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-teal/40">{product.category}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

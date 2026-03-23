import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isWishlisted = isInWishlist(product.id);

    // Get images array safely. If an older product only has "image" string, use that.
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        src={images[currentImageIndex]}
                        alt={`${product.name} - image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500"
                    />
                </Link>
                
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 shadow-sm z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 shadow-sm z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        
                        {/* Dots indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-4 bg-blue-600' : 'w-1.5 bg-gray-300/80 backdrop-blur-sm shadow-sm'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full shadow-sm uppercase tracking-wider">
                        {product.category}
                    </span>
                </div>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        if (isWishlisted) {
                            removeFromWishlist(product.id);
                        } else {
                            addToWishlist(product);
                        }
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all transform hover:scale-110 z-10 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500'}`}
                >
                    <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-2xl font-black text-gray-900">
                        ${product.price}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            const added = addToCart(product);
                            if (added) {
                                alert(`${product.name} added to cart!`);
                            } else {
                                alert(`${product.name} is already in your cart!`);
                            }
                        }}
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

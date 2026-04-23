import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function Wishlist() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center pt-32">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 border border-gray-100 shadow-retail animate-pulse">
                    <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-teal mb-4 uppercase tracking-tighter font-heading">Void Selection</h2>
                <p className="text-gray-500 mb-12 max-w-sm font-light leading-relaxed">Your curated favorites haven't been selected yet. Discover the precision in our latest collection.</p>
                <Link to="/productdetail" className="bg-orange text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-light transition-all shadow-lg shadow-orange/20">
                    Explore Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-onyx font-inter py-20 pb-32">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Archive</span>
                        <h1 className="text-4xl font-black font-heading uppercase tracking-tighter leading-none text-teal">Your Wishlist.</h1>
                    </div>
                    <button 
                        onClick={clearWishlist}
                        className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100 hover:text-red-500 transition-colors pb-1"
                    >
                        Clear Archive
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group relative flex flex-col h-full animate-fade-in bg-white rounded-retail shadow-retail border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl">
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
                                <Link to={`/product/${item.id}`} className="block w-full h-full">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    />
                                </Link>
                                
                                {/* Floating Actions */}
                                <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                    <button 
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="w-9 h-9 bg-orange text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            addToCart(item);
                                            removeFromWishlist(item.id);
                                        }}
                                        className="w-9 h-9 bg-white text-gray-400 hover:text-teal rounded-full flex items-center justify-center shadow-lg transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <Link to={`/product/${item.id}`}>
                                        <h3 className="text-sm font-bold text-onyx hover:text-teal transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{item.name}</h3>
                                    </Link>
                                    <span className="text-sm font-black text-teal">₹{item.price}</span>
                                </div>
                                <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 font-light">{item.description}</p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Archive ID: 00{item.id}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange">Saved</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Wishlist;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsAPI } from '../services/allAPI';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductsAPI();
                if (result.status === 200) {
                    const foundProduct = result.data.find(p => String(p.id) === String(id));
                    setProduct(foundProduct || null);
                }
            } catch (error) {
                console.error("Error fetching product detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold text-lg">Loading Product Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <h2 className="text-4xl font-black text-gray-900 mb-4">Product Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">The product you're looking for doesn't exist or has been removed from our catalog.</p>
                <Link to="/productdetail" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                <Link to="/productdetail" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-blue-600 transition-colors mb-12 group">
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                </Link>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Section */}
                        <div className="bg-gray-50 flex items-center justify-center p-12">
                            <div className="relative group w-full aspect-square overflow-hidden rounded-3xl bg-white shadow-inner">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute top-6 right-6">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-blue-600 text-xs font-black rounded-full shadow-sm uppercase tracking-widest border border-blue-50/50">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-12 lg:p-20 flex flex-col">
                            <div className="mb-10">
                                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-4xl font-black text-blue-600">${product.price}</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">In Stock</span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Description</h3>
                                        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 pt-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Authenticity</span>
                                            <span className="text-gray-900 font-bold">100% Genuine</span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Warranty</span>
                                            <span className="text-gray-900 font-bold">1 Year Official</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-4 items-center">
                                <button 
                                    onClick={() => {
                                        const added = addToCart(product);
                                        if (added) {
                                            alert(`${product.name} added to cart!`);
                                        } else {
                                            alert(`${product.name} is already in your cart!`);
                                        }
                                    }}
                                    className="flex-1 bg-gray-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={() => {
                                        if (isWishlisted) {
                                            removeFromWishlist(product.id);
                                        } else {
                                            addToWishlist(product);
                                        }
                                    }}
                                    className={`p-6 rounded-2xl shadow-xl transition-all active:scale-95 ${isWishlisted ? 'bg-red-500 text-white shadow-red-200' : 'bg-white text-red-500 border border-red-50 shadow-gray-100 hover:bg-red-50'}`}
                                >
                                    <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;

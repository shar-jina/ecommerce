import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsAPI } from '../services/allAPI';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isWishlisted = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductsAPI();
                if (result.status === 200) {
                    const foundProduct = result.data.find(p => String(p.id) === String(id));
                    setProduct(foundProduct || null);
                    // Set related products (simple slice for now)
                    setRelatedProducts(result.data.filter(p => String(p.id) !== String(id)).slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching product detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
                <h2 className="text-4xl font-black text-teal mb-4 font-heading uppercase tracking-tighter">Selection Missing</h2>
                <Link to="/productdetail" className="text-orange border-b-2 border-orange py-2 font-black text-xs uppercase tracking-widest hover:text-teal transition-all">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : ['https://via.placeholder.com/800x800?text=No+Image']);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="bg-background min-h-screen text-onyx font-inter pb-32">
            {/* Header Navigation */}
            <div className="container mx-auto px-6 py-8">
                <Link to="/productdetail" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-teal transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Catalog
                </Link>
            </div>

            {/* Main Product Section */}
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
                {/* Image Showcase */}
                <div className="space-y-6">
                    <div className="aspect-square bg-white rounded-retail overflow-hidden border border-gray-100 relative group shadow-retail">
                        <img 
                            src={images[currentImageIndex]} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        
                        {/* Image Navigation Arrows */}
                        {images.length > 1 && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                    onClick={prevImage}
                                    className="p-4 bg-white/80 backdrop-blur-md text-teal rounded-full hover:bg-orange hover:text-white transition-all shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="p-4 bg-white/80 backdrop-blur-md text-teal rounded-full hover:bg-orange hover:text-white transition-all shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <div className="absolute top-6 right-6">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal/40">{product.category} / 00{product.id}</span>
                        </div>
                    </div>
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-24 h-24 flex-shrink-0 rounded-retail overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-orange shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Metadata */}
                <div className="animate-fade-in flex flex-col h-full py-4">
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-teal/5 text-teal text-[10px] font-black uppercase tracking-widest rounded-full">{product.category}</span>
                            <div className="flex text-orange">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold">4.8 Rating (2.4k sales)</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tighter leading-none mb-6 text-teal">
                            {product.name}
                        </h1>
                        <p className="text-gray-500 text-lg font-light leading-relaxed mb-10 max-w-lg">
                            {product.description}
                        </p>
                        <div className="flex items-center gap-8 mb-12">
                            <span className="text-teal text-4xl font-black tracking-tight">₹{product.price}</span>
                            <div className="h-4 w-[1px] bg-gray-200"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange">In Stock — Limited Selection</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-20">
                        <button 
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-teal text-white py-6 rounded-retail font-black text-xs uppercase tracking-[0.3em] hover:bg-orange transition-all shadow-xl hover:shadow-orange/20 active:scale-95"
                        >
                            Add to Selection
                        </button>
                        <button 
                            onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                            className={`px-8 py-6 rounded-retail border-2 transition-all active:scale-95 flex items-center justify-center ${isWishlisted ? 'border-orange text-orange bg-orange/5' : 'border-gray-100 text-gray-400 hover:border-orange hover:text-orange'}`}
                        >
                            <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Technical Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-12 pt-12 border-t border-gray-100">
                        {product.specifications && Object.keys(product.specifications).length > 0 ? (
                            Object.entries(product.specifications).map(([key, value], i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal">{key}</h4>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-light">{value}</p>
                                </div>
                            ))
                        ) : (
                            // Default Fallback if no specs are added
                            [
                                { title: 'Aureate Architecture', desc: 'Fine-tuned and custom made for everyday perfection. Handcrafted systems that last a generation.' },
                                { title: 'Luminosity', desc: 'Premium performance engineered to handle varying conditions with high efficiency.' }
                            ].map((spec, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal">{spec.title}</h4>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-light">{spec.desc}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* The Curation Section */}
            <div className="bg-white py-32 text-onyx border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Hand-picked</span>
                            <h2 className="text-3xl font-black font-heading uppercase tracking-tight text-teal">The Curation.</h2>
                        </div>
                        <Link to="/productdetail" className="text-[10px] font-black uppercase tracking-[0.2em] text-teal border-b-2 border-orange transition-all pb-1 hover:text-orange">View Full Selection</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;

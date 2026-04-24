import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProductsAPI, getPostsAPI } from '../services/allAPI';
import ProductCard from '../components/ProductCard';
import PostCard from '../components/PostCard';
import HeroCarousel from '../components/HeroCarousel';

function Homepage() {
  const [products, setProducts] = useState([]);
  const [heroPosts, setHeroPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeSearch, setHomeSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResult = await getProductsAPI();
        if (productResult.status === 200) {
          setProducts(productResult.data);
        }

        const postResult = await getPostsAPI();
        if (postResult.status === 200) {
          // Get top 4 latest posts for the mosaic grid
          const sortedPosts = postResult.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setHeroPosts(sortedPosts.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate('/productdetail', { state: { query: homeSearch } });
    }
  };

    return (
        <div className="min-h-screen bg-transparent text-onyx font-inter pb-20">
            {/* Hero Grid Section */}
            <section className="pt-8 pb-16 px-6 md:px-12 bg-white">
                <div className="container mx-auto">
                    {/* Mobile Hero Carousel (Visible only on small screens) */}
                    <div className="lg:hidden mb-12">
                        {heroPosts.length > 0 ? (
                            <HeroCarousel offers={heroPosts} />
                        ) : (
                            /* Fallback Carousel for Mobile */
                            <div className="relative h-[300px] bg-[#F2F7F7] rounded-3xl overflow-hidden group">
                                <div className="absolute inset-0 flex items-center p-8">
                                    <div className="w-1/2 z-10">
                                        <h3 className="text-2xl font-black uppercase mb-4 text-onyx">System Integration.</h3>
                                        <button onClick={() => navigate('/productdetail')} className="bg-teal text-white px-6 py-2 rounded-xl font-bold text-[10px] uppercase">Explore</button>
                                    </div>
                                    <div className="w-1/2 h-full p-4">
                                        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Hero Grid (Visible only on lg screens) */}
                    <div className="hidden lg:block">
                        {heroPosts.length === 0 ? (
                            /* Case 0: Premium Fallback Grid (Static Content) */
                            <div className="grid grid-cols-12 grid-rows-2 gap-6 h-[650px] mb-12">
                                <div className="col-span-8 row-span-1 relative overflow-hidden rounded-3xl group bg-[#F2F7F7]">
                                    <div className="absolute inset-0 flex flex-row items-center">
                                        <div className="w-1/2 p-14 z-10">
                                            <span className="bg-teal/5 text-teal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">Architecture Showcase</span>
                                            <h3 className="text-5xl font-black font-heading uppercase mb-6 leading-tight text-onyx">System Integration.</h3>
                                            <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">Discovery of high-fidelity electronic systems for the modern dwell.</p>
                                            <button onClick={() => navigate('/productdetail')} className="bg-teal text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal/90 transition-all shadow-lg">Start Exploring</button>
                                        </div>
                                        <div className="w-1/2 h-full p-12">
                                            <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-3xl group bg-[#F9F3F1]">
                                    <div className="p-10 z-10 relative">
                                        <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Limited Edition</span>
                                        <h3 className="text-3xl font-black font-heading uppercase mb-4 text-teal leading-tight">Precision Audio.</h3>
                                        <button onClick={() => navigate('/productdetail', { state: { category: 'Audio' } })} className="bg-orange/10 text-orange border border-orange/20 px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-orange hover:text-white transition-all">View Selection</button>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-full h-2/3 p-8">
                                        <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop" className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                </div>

                                <div className="col-span-8 row-span-1 relative overflow-hidden rounded-3xl group bg-[#EEF2F6]">
                                    <div className="absolute inset-0 flex flex-row items-center">
                                        <div className="w-1/3 p-8 z-10">
                                            <span className="text-teal/40 text-[9px] font-black uppercase tracking-[0.2em] mb-2 block">Acquisitions</span>
                                            <h3 className="text-xl font-black font-heading uppercase mb-4 text-teal leading-tight">Visual Core.</h3>
                                            <button onClick={() => navigate('/productdetail')} className="bg-onyx text-white px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest">Discover</button>
                                        </div>
                                        <div className="w-2/3 h-full p-6">
                                            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 opacity-60" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : heroPosts.length === 1 ? (
                            /* Case 1: Single Well-Proportioned Poster Card */
                            <div className="flex justify-center mb-12">
                                <div className="w-full max-w-5xl h-[450px] relative overflow-hidden rounded-3xl group shadow-2xl bg-white p-6">
                                    <div className="w-full h-full relative rounded-2xl overflow-hidden">
                                        <img src={heroPosts[0].image} alt={heroPosts[0].title} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105 rounded-2xl " />
                                        <div className="absolute inset-0 bg-gradient-to-t from-teal/90 via-teal/20 to-transparent flex flex-col justify-end p-16 text-white">
                                            <span className="text-orange text-[10px] font-black uppercase tracking-[0.5em] mb-4">Featured Highlight</span>
                                            <h2 className="text-display tracking-tight leading-none mb-6 uppercase">{heroPosts[0].title}</h2>
                                            <p className="text-white/70 text-body max-w-xl mb-8 font-light leading-relaxed line-clamp-2">{heroPosts[0].description}</p>
                                            <div>
                                                <button onClick={() => navigate('/productdetail', { state: { category: heroPosts[0].target_category || heroPosts[0].product_id } })} className="bg-orange text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-light transition-all shadow-xl">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : heroPosts.length === 2 ? (
                            /* Case 2: Split Screen Balanced Layout */
                            <div className="grid grid-cols-2 gap-8 mb-12">
                                {heroPosts.map((post, i) => (
                                    <div key={post.id} className="relative h-[350px] overflow-hidden rounded-3xl group shadow-xl bg-white p-4">
                                        <div className="w-full h-full relative rounded-2xl overflow-hidden">
                                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal/40 to-teal/90 flex flex-col justify-end p-10 text-white">
                                                <span className="text-orange text-[9px] font-black uppercase tracking-[0.4em] mb-3">Limited Offer 0{i + 1}</span>
                                                <h3 className="text-display mb-4 leading-tight">{post.title}</h3>
                                                <Link to="/productdetail" state={{ category: post.target_category || post.product_id }} className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-orange group/btn">
                                                    EXPLORE NOW <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-orange group-hover/btn:text-white transition-all"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Case 3: Premium Mosaic Grid (3+ posts) */
                            <div className="grid grid-cols-12 grid-rows-2 gap-6 h-[700px] mb-12">
                                {/* Main Featured - Top Left */}
                                {heroPosts[0] && (
                                    <div className="col-span-8 row-span-1 relative overflow-hidden rounded-3xl group bg-[#F2F7F7]">
                                        <div className="absolute inset-0 flex flex-row items-center">
                                            <div className="w-1/2 p-14 z-10">
                                                <span className="bg-teal/5 text-teal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">Featured Collection</span>
                                                <h3 className="text-display mb-6 leading-tight text-onyx">{heroPosts[0].title}</h3>
                                                <p className="text-gray-500 text-body mb-8 max-w-xs leading-relaxed">{heroPosts[0].description?.substring(0, 80)}...</p>
                                                <button onClick={() => navigate('/productdetail', { state: { category: heroPosts[0].target_category || heroPosts[0].product_id } })} className="bg-teal text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal/90 transition-all shadow-lg">Shop Now</button>
                                            </div>
                                            <div className="w-1/2 h-full p-10">
                                                <img src={heroPosts[0].image} alt={heroPosts[0].title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tall Feature - Right Side */}
                                {heroPosts[1] && (
                                    <div className="col-span-4 row-span-2 relative overflow-hidden rounded-3xl group bg-[#F9F3F1]">
                                        <div className="p-10 z-10 relative">
                                            <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Seasonal</span>
                                            <h3 className="text-display mb-4 text-teal leading-tight">{heroPosts[1].title}</h3>
                                            <button onClick={() => navigate('/productdetail', { state: { category: heroPosts[1].target_category || heroPosts[1].product_id } })} className="bg-orange/10 text-orange border border-orange/20 px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-orange hover:text-white transition-all">Shop Now</button>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-full h-2/3 p-10">
                                            <img src={heroPosts[1].image} alt={heroPosts[1].title} className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Area */}
                                {heroPosts[2] && (
                                    <div className={`${heroPosts.length === 3 ? 'col-span-8' : 'col-span-4'} row-span-1 relative overflow-hidden rounded-3xl group bg-[#EEF2F6]`}>
                                        <div className="absolute inset-0 flex flex-row items-center">
                                            <div className={`${heroPosts.length === 3 ? 'w-1/3' : 'w-1/2'} p-8 z-10`}>
                                                <span className="text-teal/40 text-[9px] font-black uppercase tracking-[0.2em] mb-2 block">Offers</span>
                                                <h3 className="text-heading mb-4 text-teal leading-tight">{heroPosts[2].title}</h3>
                                                <button onClick={() => navigate('/productdetail', { state: { category: heroPosts[2].target_category || heroPosts[2].product_id } })} className="bg-onyx text-white px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest">Shop Now</button>
                                            </div>
                                            <div className={`${heroPosts.length === 3 ? 'w-2/3' : 'w-1/2'} h-full p-8`}>
                                                <img src={heroPosts[2].image} alt={heroPosts[2].title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fourth Post */}
                                {heroPosts.length >= 4 && (
                                    <div 
                                        onClick={() => navigate('/productdetail', { state: { category: heroPosts[3].target_category || heroPosts[3].product_id } })}
                                        className="col-span-4 row-span-1 relative overflow-hidden rounded-3xl group bg-[#FEF6F5] cursor-pointer"
                                    >
                                        <div className="absolute inset-0 flex flex-row items-center">
                                            <div className="w-full h-full relative p-6">
                                                <img src={heroPosts[3].image} alt={heroPosts[3].title} className="w-full h-full object-contain" />
                                                <div className="absolute top-8 right-8 text-right">
                                                    <span className="text-orange text-[9px] font-black uppercase tracking-widest">Limited</span>
                                                    <h3 className="text-lg font-black font-heading uppercase text-teal">{heroPosts[3].title.split(' ')[0]}</h3>
                                                    <div className="text-orange font-black text-2xl">-30%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* Circular Category Section */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center mb-12">
                        <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4">The Catalog</span>
                        <h2 className="text-heading tracking-tight uppercase text-teal">By Architecture</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { name: 'Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&auto=format&fit=crop' },
                            { name: 'Computing', img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&h=200&auto=format&fit=crop' },
                            { name: 'Visual', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&auto=format&fit=crop' },
                            { name: 'Peripherals', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&auto=format&fit=crop' },
                            { name: 'Accessories', img: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=200&h=200&auto=format&fit=crop' }
                        ].map((cat, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-4 group cursor-pointer">
                                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange transition-all p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-teal/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-teal transition-colors">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Selection */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-center md:text-left">New Acquisitions</span>
                            <h2 className="text-display tracking-tight uppercase text-teal text-center md:text-left">Featured Innovations</h2>
                        </div>
                        <Link to="/productdetail" className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-teal hover:text-orange transition-all group">
                            Explore Full Catalog
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-all shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-retail shadow-retail border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 opacity-30 italic text-teal">Awaiting next deployment...</h3>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter & Community */}
            <section className="py-24 px-6 md:px-12">
                <div className="container mx-auto bg-teal rounded-retail overflow-hidden shadow-2xl relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                        <div className="p-12 md:p-20 text-white relative z-10">
                            <span className="text-orange text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Join the Collective</span>
                            <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight mb-8">Stay informed on <br /> the future of tech.</h2>
                            <p className="text-white/60 text-sm max-w-sm mb-12 leading-relaxed">Join 50,000+ tech enthusiasts who receive our weekly curated acquisitions report.</p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="flex-1 bg-white/10 border border-white/20 px-8 py-4 rounded-full text-white placeholder:text-white/40 focus:bg-white/20 outline-none transition-all"
                                />
                                <button className="bg-orange text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-light transition-all shadow-lg shadow-orange/20">
                                    Register
                                </button>
                            </form>
                        </div>
                        <div className="h-full hidden lg:block relative">
                            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Future TECH" />
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-teal to-transparent">
                                <div className="text-center text-white/40 text-[9px] font-black tracking-widest uppercase">Verified by BITFIX Intelligent Systems</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-20 bg-white">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-1">
                            <h1 className="text-display tracking-tight text-teal font-heading mb-6">
                                <span className="text-orange">shopzy.</span>
                            </h1>
                            <p className="text-gray-400 text-body leading-relaxed max-w-xs font-light">
                                Engineering the digital boundary. Our mission is to curate the absolute pinnacle of high-fidelity electronic systems for the modern dwell.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 md:col-span-2">
                            <div className="flex flex-col gap-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-teal">Discovery</h4>
                                <Link to="/productdetail" className="text-xs text-gray-500 hover:text-orange transition-colors">Catalog</Link>
                                <Link to="/" className="text-xs text-gray-500 hover:text-orange transition-colors">Archives</Link>
                                <Link to="/wishlist" className="text-xs text-gray-500 hover:text-orange transition-colors">Wishlist</Link>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-teal">Protocol</h4>
                                <Link to="/" className="text-xs text-gray-500 hover:text-orange transition-colors">Terms of Use</Link>
                                <Link to="/" className="text-xs text-gray-500 hover:text-orange transition-colors">Privacy</Link>
                                <Link to="/" className="text-xs text-gray-500 hover:text-orange transition-colors">Logistics</Link>
                            </div>
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-teal mb-6">Connect</h4>
                           <div className="flex gap-4">
                               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-teal hover:bg-orange hover:text-white transition-all cursor-pointer shadow-sm">
                                   <i className="fa-brands fa-instagram text-sm"></i>
                               </div>
                               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-teal hover:bg-orange hover:text-white transition-all cursor-pointer shadow-sm">
                                   <i className="fa-brands fa-x-twitter text-sm"></i>
                               </div>
                               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-teal hover:bg-orange hover:text-white transition-all cursor-pointer shadow-sm">
                                   <i className="fa-brands fa-discord text-sm"></i>
                               </div>
                           </div>
                        </div>
                    </div>
                    <div className="py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">© 2026 BITFIX INTELLIGENCE COLLECTIVE.</span>
                        <div className="flex gap-6 items-center">
                            <span className="text-[9px] font-black uppercase text-gray-300">Architecture: v4.1.0</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-teal shadow-[0_0_8px_rgba(0,61,41,0.5)]"></div>
                                <span className="text-[10px] font-bold text-teal">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
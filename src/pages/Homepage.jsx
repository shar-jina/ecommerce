import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, getPostsAPI } from '../services/allAPI';
import ProductCard from '../components/ProductCard';
import PostCard from '../components/PostCard';
import HeroCarousel from '../components/HeroCarousel';

function Homepage() {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
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
          setPosts(postResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in">
            Everything Your <br />
            <span className="text-blue-200">Tech Needs</span> Fix.
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
            Premium electronics, expert repairs, and high-performance components.
            Your one-stop destination for all things tech.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl mb-12 group">
            <input 
              type="text" 
              placeholder="What tech are you looking for today?" 
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              className="w-full pl-14 pr-32 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:bg-white focus:text-gray-900 focus:ring-4 focus:ring-blue-400/20 outline-none transition-all text-white font-medium text-lg placeholder:text-blue-200/50"
            />
            <svg className="w-6 h-6 text-blue-200 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate('/productdetail')}
              className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              Shop Now
            </button>
            <button className="bg-blue-600/30 backdrop-blur-md border border-blue-400/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600/50 transition-all active:scale-95">
              Our Services
            </button>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
      </header>

      {/* Offer Banner Carousel */}
      {posts.filter(p => p.category === 'Offer').length > 0 && (
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <HeroCarousel offers={posts.filter(p => p.category === 'Offer')} />
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Explore Our Catalog</h2>
            <p className="text-gray-500">Discover the latest tech and top-rated electronics</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Phones', 'Laptops'].map((cat) => (
              <button key={cat} className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading premium tech...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Inventory is empty</h3>
            <p className="text-gray-500">Admins are currently stocking up the shelves. Check back soon!</p>
          </div>
        )}
      </main>

      {/* Latest Posts Section */}
      {posts.length > 0 && (
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Latest Tech Insights</h2>
                <p className="text-gray-500">Stay updated with the latest news, repair guides, and exclusive offers</p>
              </div>
              <button className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-2">
                View All Posts
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Fast Delivery', desc: 'Get your tech within 24-48 hours with our priority shipping.', icon: '⚡' },
              { title: 'Genuine Parts', desc: 'We only sell 100% original components and certified products.', icon: '🛡️' },
              { title: 'Expert Support', desc: 'Our technicians are available 24/7 to help with your tech issues.', icon: '🛠️' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
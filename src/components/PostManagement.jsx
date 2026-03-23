import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostsAPI, deletePostAPI, getProductsAPI } from '../services/allAPI';
import PostModal from './PostModal';

function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [postsRes, productsRes] = await Promise.all([
                getPostsAPI(),
                getProductsAPI()
            ]);

            if (postsRes.status === 200) {
                setPosts(postsRes.data);
            }
            if (productsRes.status === 200) {
                const prodMap = productsRes.data.reduce((acc, p) => {
                    acc[p.id] = p;
                    return acc;
                }, {});
                setProducts(prodMap);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            const token = sessionStorage.getItem("token");
            const reqHeader = {
                "Authorization": `Bearer ${token}`
            };
            try {
                const result = await deletePostAPI(id, reqHeader);
                if (result.status === 200) {
                    alert("Post deleted successfully");
                    fetchData();
                }
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    const handleEdit = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedPost(null);
        setIsModalOpen(true);
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Offer Engine</h1>
                    <p className="text-gray-500 font-medium">Manage your homepage banners, deals, and tech updates</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:shadow-blue-200 flex items-center gap-3 group active:scale-95"
                >
                    <div className="bg-white/20 p-1 rounded-lg">
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    New Announcement
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Posts</p>
                    <p className="text-3xl font-black text-gray-900">{posts.length}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-[24px] border border-green-100">
                    <p className="text-green-600/50 text-xs font-black uppercase tracking-widest mb-1">Active Offers</p>
                    <p className="text-3xl font-black text-green-700">{posts.filter(p => p.category === 'Offer').length}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-[24px] border border-blue-100">
                    <p className="text-blue-600/50 text-xs font-black uppercase tracking-widest mb-1">Updates</p>
                    <p className="text-3xl font-black text-blue-700">{posts.filter(p => p.category === 'Update').length}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="pl-12 w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table style similar to Product Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Banner / Title</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Product</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Deal</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Synchronizing deals...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => {
                                    const linkedProduct = products[post.product_id];
                                    return (
                                        <tr key={post.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-sm border border-gray-100"
                                                         onClick={() => post.product_id && navigate(`/product/${post.product_id}`)}
                                                         title={post.product_id ? "View Linked Product Details" : "No Product Linked"}
                                                    >
                                                        {post.image ? (
                                                            <img
                                                                src={post.image}
                                                                alt={post.title}
                                                                className="w-16 h-12 object-cover transition-transform group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-12 bg-gray-100 flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        {post.product_id && (
                                                            <div className="absolute top-0 right-0 p-1">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-black text-gray-900 text-base leading-tight">{post.title}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Created {new Date(post.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                    post.category === 'Offer' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                    post.category === 'Update' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                    'bg-purple-50 text-purple-600 border border-purple-100'
                                                }`}>
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                {linkedProduct ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900 font-bold text-sm">{linkedProduct.name}</span>
                                                        <span className="text-blue-500 font-black text-xs">${linkedProduct.price}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 italic text-sm font-medium">—</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 font-black text-blue-600">
                                                {post.discount_label || <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(post)}
                                                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                                                        title="Refine Offer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                                                        title="Remove Post"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No matching announcements found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                post={selectedPost}
                onUpdate={fetchData}
            />
        </div>
    );
}

export default PostManagement;

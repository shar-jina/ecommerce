import React, { useState, useEffect } from 'react';
import { addPostAPI, updatePostAPI, getProductsAPI } from '../services/allAPI';

const PostModal = ({ isOpen, onClose, post, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Offer',
        product_id: '',
        discount_label: ''
    });
    const [products, setProducts] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const reqHeader = {
                "Authorization": `Bearer ${token}`
            };
            const result = await getProductsAPI(reqHeader);
            if (result.status === 200) {
                setProducts(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch products for modal", error);
        }
    };

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                content: post.content || '',
                category: post.category || 'Offer',
                product_id: post.product_id || '',
                discount_label: post.discount_label || ''
            });
            setPreview(post.image || '');
        } else {
            setFormData({
                title: '',
                content: '',
                category: 'Offer',
                product_id: '',
                discount_label: ''
            });
            setPreview('');
            setImage(null);
        }
    }, [post, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = sessionStorage.getItem('token');
        const reqHeader = {
            "Content-Type": image ? "multipart/form-data" : "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            let result;
            if (post) {
                // Update Post
                if (image) {
                    const updateData = new FormData();
                    Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
                    updateData.append('image', image);
                    result = await updatePostAPI(post.id, updateData, reqHeader);
                } else {
                    result = await updatePostAPI(post.id, formData, reqHeader);
                }
            } else {
                // Add Post
                const addData = new FormData();
                Object.keys(formData).forEach(key => addData.append(key, formData[key]));
                if (image) addData.append('image', image);
                result = await addPostAPI(addData, reqHeader);
            }

            if (result.status === 201 || result.status === 200) {
                alert(post ? "Post updated successfully" : "Post added successfully");
                onUpdate();
                onClose();
            } else {
                alert(result?.data?.message || result?.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving post");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden transform transition-all border border-gray-100 flex flex-col max-h-[90vh]">
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                {post ? 'Refine Post' : 'Create New Post'}
                            </h2>
                            <p className="text-gray-500 text-sm">Fill in the details for your tech announcement</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Post Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Summer Tech Extravaganza"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                <select
                                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Offer">Offer</option>
                                    <option value="Update">Update</option>
                                    <option value="Announcement">Announcement</option>
                                </select>
                            </div>

                            {formData.category === 'Offer' && (
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Discount Label</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-blue-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-blue-600 placeholder:text-blue-200"
                                        value={formData.discount_label}
                                        onChange={(e) => setFormData({ ...formData, discount_label: e.target.value })}
                                        placeholder="e.g. 50% OFF"
                                    />
                                </div>
                            )}

                            {formData.category === 'Offer' && (
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Link to Product</label>
                                    <select
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-900"
                                        value={formData.product_id}
                                        onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                    >
                                        <option value="">No specific product (General Offer)</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Content/Description</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium text-gray-700 placeholder:text-gray-300"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Describe the offer or announcement details..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Post Visual (Image)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-3xl hover:border-blue-400 transition-colors cursor-pointer relative bg-gray-50/50">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                <div className="space-y-1 text-center">
                                    {preview ? (
                                        <div className="relative group">
                                            <img src={preview} alt="Preview" className="mx-auto h-40 w-full object-cover rounded-2xl shadow-lg transition-all group-hover:scale-[1.02]" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="font-bold text-blue-600">Upload high-res banner</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PNG, JPG, GIF up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {loading ? 'Saving...' : (post ? 'Update Post' : 'Publish Post')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostModal;

import React, { useState, useEffect } from 'react';
import { addProductAPI, updateProductAPI } from '../services/allAPI';

const ProductModal = ({ isOpen, onClose, product, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                category: product.category || '',
                stock: product.stock || '',
            });
            if (product.images && product.images.length > 0) {
                setPreviews(product.images);
            } else if (product.image) {
                setPreviews([product.image]);
            } else {
                setPreviews([]);
            }
        } else {
            setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                stock: '',
            });
            setPreviews([]);
            setImages([]);
        }
    }, [product, isOpen]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(files);
            const filePreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(filePreviews);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = sessionStorage.getItem('token');
        const reqHeader = {
            "Content-Type": images.length > 0 ? "multipart/form-data" : "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            let result;
            if (product) {
                // Update Product
                const updateData = images.length > 0 ? new FormData() : { ...formData };
                if (images.length > 0) {
                    Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
                    images.forEach(img => updateData.append('images', img));
                }

                result = await updateProductAPI(product.id, images.length > 0 ? updateData : formData, reqHeader);
            } else {
                // Add Product
                const addData = new FormData();
                Object.keys(formData).forEach(key => addData.append(key, formData[key]));
                images.forEach(img => addData.append('images', img));
                result = await addProductAPI(addData, reqHeader);
            }

            if (result.status === 201 || result.status === 200) {
                alert(product ? "Product updated successfully" : "Product added successfully");
                onUpdate();
                onClose();
            } else {
                const errorMsg = result.response?.data?.message || result.message || "Something went wrong";
                alert(errorMsg);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error saving product: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    placeholder="Quantity"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Category e.g. Electronics"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Product description..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                            <div className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                <div className="space-y-1 text-center w-full">
                                    {previews.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-2 mt-2 relative z-0">
                                            {previews.map((preview, idx) => (
                                                <img key={idx} src={preview} alt={`Preview ${idx}`} className="h-20 w-full object-cover rounded-lg shadow-sm border border-gray-100" />
                                            ))}
                                            <div className="flex items-center justify-center h-20 w-full bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-xs text-center p-1">
                                                Click to replace all
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="font-medium text-blue-600">Upload multiple files</span>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

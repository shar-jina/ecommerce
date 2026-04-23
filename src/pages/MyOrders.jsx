import React, { useEffect, useState } from 'react';
import { getUserOrdersAPI } from '../services/allAPI';
import { Link } from 'react-router-dom';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const header = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            const result = await getUserOrdersAPI(header);
            if (result.status === 200) {
                setOrders(result.data);
            }
        } catch (err) {
            console.error("Fetch orders failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tight">Purchase History</h1>
                
                {orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-16 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Ready to upgrade your tech game? Your future orders will appear here.</p>
                        <Link to="/productdetail" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-blue-200 transition-all">
                                <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="text-xl font-black text-gray-900">#{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-sm font-bold text-gray-700">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-2xl font-black text-blue-600">₹{order.total_amount}</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-bold text-gray-900">{item.product_name}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-900">₹{(item.quantity * item.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                        <p><strong>Shipping to:</strong> {order.shipping_address}</p>
                                        <p><strong>Contact:</strong> {order.contact_number}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;

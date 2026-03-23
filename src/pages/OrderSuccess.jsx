import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Order Placed!</h1>
            <p className="text-xl text-gray-500 mb-8 max-w-md">
                Thank you for your purchase. Your premium tech is being prepared for shipment.
            </p>

            <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-xl shadow-gray-200/50 mb-10 w-full max-w-sm">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Order Reference</p>
                <p className="text-3xl font-black text-blue-600">#{orderId || "N/A"}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/myorders" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200">
                    View My Orders
                </Link>
                <Link to="/" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default OrderSuccess;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center p-8 text-center pt-32">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 border border-white/10 animate-pulse">
                <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Selection Confirmed</span>
            <h1 className="text-[40px] font-black font-heading uppercase tracking-tighter leading-none mb-6">Success.</h1>
            <p className="text-gray-500 text-[11px] uppercase tracking-widest font-light mb-12 max-w-sm leading-relaxed">
                Thank you for your acquisition. Your premium selection is being prepared for immediate dispatch.
            </p>

            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-sm mb-12 w-full max-w-sm">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Order Protocol ID</p>
                <p className="text-3xl font-black text-white tracking-tighter">#{orderId || "ARCH-001"}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/myorders" className="bg-white text-black px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all active:scale-[0.98]">
                    View My Selection
                </Link>
                <Link to="/" className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5 hover:text-white hover:border-white transition-all pb-1">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}

export default OrderSuccess;

import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrderAPI } from '../services/allAPI';

function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    
    // Checkout States
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        phone: ""
    });

    const handleCheckout = async (e) => {
        e.preventDefault();
        
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Please login to place an order");
            navigate('/login');
            return;
        }

        if (!shippingInfo.address || !shippingInfo.phone) {
            alert("Please provide all shipping details");
            return;
        }

        const header = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const orderData = {
            items: cart,
            total_amount: getCartTotal(),
            shipping_address: shippingInfo.address,
            contact_number: shippingInfo.phone
        };

        try {
            const result = await placeOrderAPI(orderData, header);
            if (result.status === 201) {
                alert("Order placed successfully!");
                clearCart();
                navigate('/ordersuccess', { state: { orderId: result.data.orderId } });
            } else {
                alert("Order failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while placing your order.");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any premium tech to your cart yet. Start exploring our catalog to find what you need!</p>
                <Link to="/productdetail" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-end mb-8">
                            <h1 className="text-4xl font-black text-gray-900">Your Cart</h1>
                            <button onClick={clearCart} className="text-gray-400 font-bold text-sm hover:text-red-500 transition-colors">Clear Cart</button>
                        </div>
                        
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-6 border border-gray-100 hover:shadow-md transition-shadow">
                                    <Link to={`/product/${item.id}`} className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                    </Link>
                                    
                                    <div className="flex-grow text-center sm:text-left">
                                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors">{item.name}</h3>
                                        </Link>
                                        <p className="text-2xl font-black text-gray-900">${item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="text-lg font-black text-gray-900 w-8 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96">
                        <div className="bg-gray-900 p-8 rounded-[40px] text-white sticky top-28 shadow-2xl shadow-blue-200">
                            <h2 className="text-2xl font-black mb-8">Summary</h2>
                            
                            {!showCheckout ? (
                                <>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-gray-400 font-medium">
                                            <span>Subtotal</span>
                                            <span className="text-white">${getCartTotal()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400 font-medium">
                                            <span>Shipping</span>
                                            <span className="text-green-400">FREE</span>
                                        </div>
                                        <div className="h-px bg-white/10 my-4"></div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-4xl font-black text-blue-400">${getCartTotal()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-900/40"
                                    >
                                        Checkout
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleCheckout} className="space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-blue-400">Shipping Details</h3>
                                        <button type="button" onClick={() => setShowCheckout(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Address</label>
                                            <textarea 
                                                required
                                                rows="3"
                                                value={shippingInfo.address}
                                                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:bg-white/10 focus:border-blue-500 transition-all outline-none resize-none"
                                                placeholder="Street city, state, zip"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Contact Number</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={shippingInfo.phone}
                                                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:bg-white/10 focus:border-blue-500 transition-all outline-none"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10 my-4"></div>
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-3xl font-black text-blue-400">${getCartTotal()}</span>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full bg-green-500 py-5 rounded-2xl font-black text-xl hover:bg-green-400 transition-all active:scale-95 shadow-xl shadow-green-900/40"
                                    >
                                        Place Order
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
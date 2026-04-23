import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrderAPI, getPaymentSettingsAPI } from '../services/allAPI';

function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    
    // Checkout States
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        phone: ""
    });
    
    // Payment States
    const [paymentSettings, setPaymentSettings] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [fetchingSettings, setFetchingSettings] = useState(false);

    const initiateCheckout = async () => {
        setFetchingSettings(true);
        try {
            const result = await getPaymentSettingsAPI();
            if (result.status === 200) {
                setPaymentSettings(result.data);
                // default select an option if available
                if (result.data.cod_enabled) setSelectedPayment('cod');
                else if (result.data.online_enabled) setSelectedPayment('online');
            }
        } catch (error) {
            console.error("Failed to load payment config", error);
        } finally {
            setFetchingSettings(false);
            setShowCheckout(true);
        }
    };

    const handleCheckoutSubmit = async (e) => {
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
            contact_number: shippingInfo.phone,
            payment_method: selectedPayment
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center pt-32">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 border border-gray-100 shadow-retail animate-pulse">
                    <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-teal mb-4 uppercase tracking-tighter font-heading">Empty Selection</h2>
                <p className="text-gray-500 mb-12 max-w-sm font-light leading-relaxed">It seems your curated collective is currently vacant. Start exploring our fine-tuned catalog.</p>
                <Link to="/productdetail" className="bg-orange text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-light transition-all shadow-lg shadow-orange/20">
                    Explore Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-onyx font-inter py-20 pb-32">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Cart Items List */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <span className="text-orange text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Selection</span>
                                <h1 className="text-4xl font-black font-heading uppercase tracking-tighter text-teal">Your Bag.</h1>
                            </div>
                            <button onClick={clearCart} className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100 hover:text-red-500 transition-colors pb-1">Empty Bag</button>
                        </div>
                        
                        <div className="space-y-10">
                            {cart.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-10 bg-white p-6 rounded-retail shadow-retail border border-gray-50 group">
                                    <Link to={`/product/${item.id}`} className="w-32 aspect-square bg-gray-50 border border-gray-100 overflow-hidden rounded-retail relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                                    </Link>
                                    
                                    <div className="flex-grow text-center sm:text-left">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{item.category}</span>
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-teal transition-colors font-heading uppercase tracking-widest text-onyx">{item.name}</h3>
                                        </Link>
                                        <p className="text-xl font-black text-teal">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-4 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-gray-400 hover:text-teal transition-colors disabled:opacity-20"
                                                disabled={item.quantity <= 1}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="text-sm font-black w-6 text-center text-teal">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-gray-400 hover:text-teal transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[450px]">
                        <div className="bg-white p-10 rounded-retail border border-gray-100 shadow-retail sticky top-40">
                            <h2 className="text-lg font-black font-heading uppercase tracking-[0.2em] mb-10 border-b border-gray-50 pb-6 text-teal">Summary</h2>
                            
                            {!showCheckout ? (
                                <div className="animate-fade-in">
                                    <div className="space-y-6 mb-12">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <span>Subtotal</span>
                                            <span className="text-teal">₹{getCartTotal()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <span>Shipping</span>
                                            <span className="text-orange font-black tracking-[0.2em]">Complimentary</span>
                                        </div>
                                        <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pb-2">Total Amount</span>
                                            <span className="text-5xl font-black text-teal tracking-tighter">₹{getCartTotal()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={initiateCheckout}
                                        disabled={fetchingSettings}
                                        className="w-full bg-teal text-white py-6 rounded-retail font-black text-xs uppercase tracking-[0.3em] hover:bg-orange transition-all shadow-xl hover:shadow-orange/20 disabled:opacity-50 active:scale-95"
                                    >
                                        {fetchingSettings ? 'Finalizing...' : 'Continue to Checkout'}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleCheckoutSubmit} className="space-y-8 animate-fade-in">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange">Checkout Details</h3>
                                        <button type="button" onClick={() => setShowCheckout(false)} className="text-[9px] text-gray-400 uppercase tracking-widest hover:text-teal font-black">Cancel</button>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Shipping Destination</label>
                                            <textarea 
                                                required
                                                rows="2"
                                                value={shippingInfo.address}
                                                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-retail px-8 py-5 text-sm font-light focus:border-teal outline-none transition-all placeholder:text-gray-300 text-teal"
                                                placeholder="Street city, state, zip"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Contact Number</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={shippingInfo.phone}
                                                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-retail px-8 py-5 text-sm font-light focus:border-teal outline-none transition-all placeholder:text-gray-300 text-teal"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    {paymentSettings && (
                                        <div className="space-y-6">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block">Method of Payment</label>
                                            <div className="space-y-3">
                                                {paymentSettings.cod_enabled && (
                                                    <label className={`flex items-center gap-4 p-6 rounded-retail border-2 cursor-pointer transition-all ${selectedPayment === 'cod' ? 'border-orange bg-orange/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                                                        <input type="radio" name="payment" value="cod" checked={selectedPayment === 'cod'} onChange={(e) => setSelectedPayment(e.target.value)} className="w-5 h-5 accent-orange" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-teal">Cash on Delivery</span>
                                                    </label>
                                                )}
                                                {paymentSettings.online_enabled && (
                                                    <label className={`flex items-center gap-4 p-6 rounded-retail border-2 cursor-pointer transition-all ${selectedPayment === 'online' ? 'border-orange bg-orange/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                                                        <input type="radio" name="payment" value="online" checked={selectedPayment === 'online'} onChange={(e) => setSelectedPayment(e.target.value)} className="w-5 h-5 accent-orange" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-teal">Online Transfer</span>
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-8 border-t border-gray-50 flex justify-between items-end mb-8">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pb-2">Total Settlement</span>
                                        <span className="text-4xl font-black text-teal tracking-tighter">₹{getCartTotal()}</span>
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        disabled={!selectedPayment}
                                        className="w-full bg-orange py-6 text-white rounded-retail font-black text-[10px] uppercase tracking-[0.3em] hover:bg-teal transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-orange/10"
                                    >
                                        Place Selection Order
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
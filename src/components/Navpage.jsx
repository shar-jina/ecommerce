import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getNotificationsAPI } from '../services/allAPI'

function Navpage() {
    const { getCartCount } = useCart()
    const { wishlist } = useWishlist()
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [role, setRole] = useState("")
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        fetchNotifications()
    }, [location])

    const fetchNotifications = async () => {
        try {
            const result = await getNotificationsAPI()
            if (result.status === 200) {
                setNotifications(result.data)
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        if (token) {
            setIsLoggedIn(true)
            setRole(sessionStorage.getItem("role"))
        } else {
            setIsLoggedIn(false)
            setRole("")
        }
        setIsMobileMenuOpen(false)
        setShowNotifications(false)
    }, [location])

    const handleLogout = () => {
        sessionStorage.clear()
        setIsLoggedIn(false)
        setRole("")
        setIsMobileMenuOpen(false)
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50">
           

            {/* Main Navigation - Tier 1 */}
            <nav className="bg-white border-b border-gray-100 px-6 md:px-12 py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between gap-8">
                    {/* Brand */}
                    <Link to="/" className="text-2xl font-black tracking-tight text-teal font-heading">
                        <span className="text-orange">shopzy</span>
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="hidden lg:flex flex-1 max-w-2xl relative">
                        <div className="flex w-full items-center bg-gray-50 rounded-full border border-gray-200 overflow-hidden focus-within:border-teal transition-all p-1">
                            <input 
                                type="text"
                                placeholder="Search the collection..."
                                className="flex-1 bg-transparent px-6 py-2.5 text-sm outline-none text-onyx placeholder:text-gray-400"
                            />
                            <button className="bg-teal text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-light transition-all">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Notifications */}
                        <div className="relative group">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-400 hover:text-teal transition-colors flex flex-col items-center gap-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Alerts</span>
                                {notifications.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-orange rounded-full border-2 border-white"></span>}
                            </button>
                        </div>

                        {/* Wishlist */}
                        <Link to="/wishlist" className="text-gray-400 hover:text-teal transition-colors flex flex-col items-center gap-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Wishlist</span>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="text-gray-400 hover:text-teal transition-colors flex flex-col items-center gap-1 relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Cart</span>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal transition-colors group">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Exit</span>
                            </button>
                        ) : (
                            <Link to="/login" className="flex flex-col items-center gap-1 text-gray-400 hover:text-teal transition-colors group">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all text-gray-500">
                                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                   </svg>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Join</span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button className="lg:hidden text-teal p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Navigation - Tier 2 */}
            <div className="bg-white border-b border-gray-100 hidden lg:block">
                <div className="container mx-auto px-12">
                    <div className="flex items-center gap-10 py-3">
                        <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-orange ${location.pathname === '/' ? 'text-orange border-b-2 border-orange pb-3 -mb-3' : 'text-teal'}`}>
                            Home
                        </Link>
                        <Link to="/productdetail" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-orange ${location.pathname === '/productdetail' ? 'text-orange border-b-2 border-orange pb-3 -mb-3' : 'text-teal'}`}>
                            Catalog
                        </Link>
                        <Link to="/wishlist" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-orange ${location.pathname === '/wishlist' ? 'text-orange border-b-2 border-orange pb-3 -mb-3' : 'text-teal'}`}>
                            Archive
                        </Link>
                        {(role === "admin" || role === "manager" || role === "superadmin") && (
                            <Link to="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-orange ${location.pathname === '/dashboard' ? 'text-orange border-b-2 border-orange pb-3 -mb-3' : 'text-teal'}`}>
                                Admin
                            </Link>
                        )}
                      
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/90 z-40 flex flex-col items-center justify-center gap-8 md:hidden backdrop-blur-lg">
                    <Link to="/" className="text-xl uppercase tracking-[0.3em] text-white">Home</Link>
                    <Link to="/productdetail" className="text-xl uppercase tracking-[0.3em] text-white">Shop</Link>
                    <Link to="/wishlist" className="text-xl uppercase tracking-[0.3em] text-white">Wishlist</Link>
                    <Link to="/myorders" className="text-xl uppercase tracking-[0.3em] text-white">My Orders</Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="text-orange uppercase tracking-[0.3em] mt-4 font-black">Logout</button>
                    ) : (
                        <Link to="/login" className="text-orange uppercase tracking-[0.3em] mt-4 font-black">Login</Link>
                    )}
                </div>
            )}
        </header>
    )
}

export default Navpage

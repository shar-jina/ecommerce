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
    }, [location])

    const handleLogout = () => {
        sessionStorage.clear()
        setIsLoggedIn(false)
        setRole("")
        navigate('/login')
    }

    return (
        <>
            <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                    SHOP<span className="text-gray-900">ZY</span>
                </Link>

                <div className="flex gap-8 items-center font-medium">
                    <Link 
                        to="/" 
                        className={`transition-colors ${location.pathname === '/' ? 'text-blue-600 font-black' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                        Home
                    </Link>

                    {(role === "admin" || role === "manager" || role === "superadmin") && (
                        <Link 
                            to="/dashboard" 
                            className={`transition-colors ${location.pathname === '/dashboard' ? 'text-blue-600 font-black' : 'text-gray-700 hover:text-blue-600'}`}
                        >
                            Dashboard
                        </Link>
                    )}
                    
                    <Link 
                        to="/productdetail" 
                        className={`transition-colors ${location.pathname === '/productdetail' ? 'text-blue-600 font-black' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                        Shop
                    </Link>

                    <Link 
                        to={'/wishlist'} 
                        className={`transition-colors relative flex items-center gap-2 ${location.pathname === '/wishlist' ? 'text-blue-600 font-black' : 'text-gray-400 hover:text-blue-600'}`}
                    >
                        Wishlist
                        {wishlist.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-all relative"
                            title="Notifications"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] py-2 max-h-[400px] overflow-y-auto">
                                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">New</span>
                                </div>
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div key={n.id} className="px-4 py-3 hover:bg-blue-50/50 transition-colors border-b border-gray-50 last:border-0 cursor-default">
                                            <p className="font-bold text-gray-900 text-xs mb-1">{n.title}</p>
                                            <p className="text-gray-600 text-xs leading-relaxed">{n.message}</p>
                                            <p className="text-[9px] text-gray-400 mt-2 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(n.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-gray-400 text-xs italic">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Link 
                        to={'/myorders'} 
                        className={`transition-colors font-bold ${location.pathname === '/myorders' ? 'text-blue-600 font-black' : 'text-gray-400 hover:text-blue-600'}`}
                    >
                        My Orders
                    </Link>

                    <Link 
                        to="/cart" 
                        className={`relative group transition-colors ${location.pathname === '/cart' ? 'text-blue-600 font-black' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                        <span>Cart</span>
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm animate-bounce">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Login
                        </Link>
                    )}

                </div>

            </nav>
        </>
    )
}

export default Navpage

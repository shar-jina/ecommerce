
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Prdctdetail from './pages/Prdctdetail'
import Registerpage from './pages/Registerpage'
import Navpage from './components/Navpage'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import Wishlist from './pages/Wishlist'
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import ProtectedRoute from './components/ProtectedRoute';







function App() {

  return (
    <>
    <Navpage/>
    <Routes>
      <Route  path={'/'} element={<Homepage/>} />
      <Route  path={'/login'} element={<Loginpage/>} />
      <Route  path={'/register'} element={<Registerpage/>} />

      {/* Protected Routes */}
      <Route path={'/productdetail'} element={<ProtectedRoute><Prdctdetail/></ProtectedRoute>} />
      <Route path={'/cart'} element={<ProtectedRoute><Cart/></ProtectedRoute>} />
      <Route path={'/dashboard'} element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path={'/product/:id'} element={<ProtectedRoute><ProductDetail/></ProtectedRoute>} />
      <Route path={'/wishlist'} element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />
      <Route path={'/ordersuccess'} element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      <Route path={'/myorders'} element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />




      


    </Routes>
    </>
  )
}

export default App

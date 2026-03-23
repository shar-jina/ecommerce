
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







function App() {

  return (
    <>
    <Navpage/>
    <Routes>
      <Route  path={'/'} element={<Homepage/>} />
      <Route  path={'/login'} element={<Loginpage/>} />
      <Route  path={'/productdetail'} element={<Prdctdetail/>} />
      <Route  path={'/register'} element={<Registerpage/>} />
      <Route  path={'/cart'} element={<Cart/>} />
      <Route  path={'/dashboard'} element={<Dashboard/>} />
      <Route  path={'/product/:id'} element={<ProductDetail/>} />
      <Route  path={'/wishlist'} element={<Wishlist/>} />
      <Route path={'/ordersuccess'} element={<OrderSuccess />} />
      <Route path={'/myorders'} element={<MyOrders />} />




      


    </Routes>
    </>
  )
}

export default App

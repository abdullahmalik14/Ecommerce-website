
import Navbar from './components/navbar/Navbar'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Shop from './pages/Shop'
import ShopCategory from './pages/ShopCategory'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup'
import Footer from './components/footer/Footer'
import banner_mens from "./assets/banner_mens.png"
import banner_women from "./assets/banner_women.png"
import banner_kids from "./assets/banner_kids.png"

function App() {

  return (
    <>
    <div className="app">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='mens' element={<ShopCategory banner ={banner_mens} category='men'/>}/>
        <Route path='/womens' element={<ShopCategory banner = {banner_women} category='women'/>}/>
        <Route path='/kids' element={<ShopCategory banner = {banner_kids} category='kid'/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
      <Footer/>
    </div>
       
    </>
  )
}

export default App

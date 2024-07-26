import React, { useContext, useRef, useState } from 'react'
import "./Navbar.css"
import logo from "../../assets/logo.png"
import cart_icon from "../../assets/cart_icon.png"
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import nav_icon from "../../assets/Nav_icon.png"
const Navbar = () => {
    const [menu,setMenu] = useState("shop")
    const {getTotalCartItem} =useContext(ShopContext)
    const menuRef = useRef()
    const dropdown_toggle =(e)=>{
        menuRef.current.classList.toggle('nav-menu-visible')
        e.target.classList.toggle('open')
    }  
    
    return (
    <div className='navbar'>
        <img className='dropdown-toggle' onClick={dropdown_toggle} src={nav_icon} alt="" />

        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>SHOPPER</p>
        </div>
        <ul ref={menuRef} className='nav-menu'>
            <li onClick={()=>setMenu("shop")}><Link style={{textDecoration:"none"}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>setMenu("men")}><Link style={{textDecoration:"none"}} to='/mens'>Men</Link>{menu==="men"?<hr/>:<></>}</li>
            <li onClick={()=>setMenu("women")}><Link style={{textDecoration:"none"}} to='womens'>Women</Link>{menu==="women"?<hr/>:<></>}</li>
            <li onClick={()=>setMenu("kids")}><Link style={{textDecoration:"none"}} to='kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
            {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/login')}}>Logout</button>
            :<Link to='/login'><button>Login</button></Link>}
            
           <Link to='cart'> <img src={cart_icon} alt="" /></Link>
            <div className="nav-cart-count">
                {getTotalCartItem()}
            </div>
        </div>
    </div>
  )
}

export default Navbar
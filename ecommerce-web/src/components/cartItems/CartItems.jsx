import React, { useContext } from 'react'
import "./CartItems.css"
import { ShopContext } from '../../context/ShopContext'
import remove_icon from "../../assets/cart_cross_icon.png"
import all_product from '../../assets/all_product'
const Cartitems = () => {
    const {all_product,cartItems,removeFromCart,getTotalAmount} = useContext(ShopContext)
  return (
    <div className='cart-items'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
       <hr />
      {all_product.map((e,i) => {
        if(cartItems[e.id]>0)
        {
            return  <div key={i}>
            <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className='carticon-product-icon'/>
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>${e.new_price * cartItems[e.id]}</p>
                <img className='cartitems-remove-icon' src={remove_icon} alt="" onClick={() => {removeFromCart(e.id)}}/>
            </div>
            <hr />
        </div>
        }
      return null;
      })}
    <div className="cartitems-down">
        <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
                <div className="cartitems-total-items">
                    <p>SubTotal</p>
                    <p>${getTotalAmount()}</p>
                </div>
                <hr />

                <div className="cartitems-total-items">
                    <p>Shipping fee</p>
                    <p>free</p>
                </div>
                <hr />

                <div className="cartitems-total-items">
                    <h3>Total</h3>
                    <h3>${getTotalAmount()}</h3>
                </div>
                <hr />
            </div>

            <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promo-code">
            <p>If you have a promocode, Enter it here</p>
            <div className="cartitems-promobox">
                <input type="text" placeholder='Promo Code' />
                <button>Submit</button>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Cartitems
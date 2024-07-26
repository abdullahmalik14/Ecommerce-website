import React, { createContext, useEffect, useState } from "react";
export const ShopContext = createContext(null)



//getdefault cart funtion islie bnaya gya hai keh cart mein 300 items ki capacity 
//rahe jb hum items add karein tou hum 300 items cart ke andar rkh skte hain......
const getDefaultCart=()=>{
    let cart=[];
    for (let index = 0; index < 300+1; index++) {
        cart[index]= 0;
    }
    return cart;
}

const ShopContextProvider = (props)=>{

    //is usestate mein shopping cart ke items aur unki quantities save hoti hain
    
    const [cartItems,setCartItems] = useState(getDefaultCart());

    //is usestate mein all products ki information save hoti hai jo server se fetch ki gyi hai.....
    const [all_product,setallproduct] = useState([])


    //Ye component mount hone par server se saare products ki information fetch karta hai aur
    // all_product state variable ko update karta hai.
    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((res)=>res.json()).then((data)=>setallproduct(data));

        if(localStorage.getItem("auth-token")){
            fetch("http://localhost:4000/getcart",{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    "auth-token":`${localStorage.getItem("auth-token")}`,
                    "content-type":"application/json",
                },
                body:""
            }).then((res)=>res.json()).then((data)=>setCartItems(data))
            
        }
    },[])


    //
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem('auth-token')}`,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ "itemId": itemId })
            }).then((res) => res.json()).then((body) => console.log(body))
        }
    }

    
    const removeFromCart =(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem("auth-token")){
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem('auth-token')}`,
                    "Content-Type": "application/json" // Changed content type here
                },
                body: JSON.stringify({ "itemId": itemId })
            }).then((res) => res.json()).then((body) => console.log(body))
        }
    }

    const getTotalAmount = ()=>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let iteminfo = all_product.find((product)=>{
                    return product.id===Number(item);
                })
                totalAmount += iteminfo.new_price * cartItems[item]
            }
        }
        return totalAmount;
    }
    const getTotalCartItem =()=>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0){
                totalItem += cartItems[item]
            }
        }
        return totalItem;
    }

    
    const contextValue = {getTotalCartItem,getTotalAmount,all_product,cartItems,addToCart,removeFromCart}

    return (
        <ShopContext.Provider value={contextValue}>
                {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
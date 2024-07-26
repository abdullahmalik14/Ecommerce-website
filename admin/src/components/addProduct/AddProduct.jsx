// import React, { useState } from 'react'
// import "./AddProduct.css"
// import upload_area from "../../assets/upload_area.svg"
// const AddProduct = () => {
//   const [image,setImage] = useState(false)
//   const [productDetails,setProductDetails] = useState({
//     name:"",
//     image:"",
//     old_price:"",
//     new_price:"",
//     category:""
//   })

//   const image_handler =(e)=>{
//     setImage(e.target.files[0])
//   }

//   const change_handler= (e)=>{
//       setProductDetails({...productDetails,[e.target.name]:e.target.value})
//   }

//   const add_product =async ()=>{
//     try{
//       let responseData;
//       let product = productDetails;
//       let formData = new FormData();
//       formData.append("product",image);
//      const response=  await fetch("http://localhost:4000/upload",{
//         method:"POST",
//         headers:{
//           Accept:"application/json"
//         },
//         body:formData,
//       })

//       responseData =await response.json()
  
//       if(responseData.success){
//         product.image = responseData.image_url;
//         console.log(product) 
//         await fetch("http://localhost:4000/addproduct",{
//           method:"POST",
//           header:{
//             Accept:"application/json",
//            "content-type":"application/json"
//           },
//           body:JSON.stringify(product)
//         }).then((resp)=>resp.json()).then((data)=>{
//           data.success?alert("Product  added"):alert("failed")
//         })
//       }
//     }catch(error){
//         console.log("Error occurred while fetching",error);
//     }
   
//   }
//   return (
//     <div className='addproduct'>
//       <div className="addproduct-itemfield">
//         <p>Product title</p>
//         <input value={productDetails.name} onChange={change_handler} type="text" placeholder='Type here'  name='name'/>
//       </div>

//       <div className="addproduct-price">
//         <div className="addproduct-itemfield">
//           <p>Price</p>
//           <input value={productDetails.old_price} onChange={change_handler} type="text" name='old_price'  placeholder='Type here'/>
//         </div>

//         <div className="addproduct-itemfield">
//           <p>Offer</p>
//           <input value={productDetails.new_price} onChange={change_handler} type="text" name='new_price'  placeholder='Type here'/>
//         </div>
//       </div>

//       <div className="addproduct-itemfield">
//         <p>Product Category</p>
//         <select value={productDetails.category} onChange={change_handler} name="category" className='addproduct-selector'>
//           <option value="women">Women</option>
//           <option value="men">Men</option>
//           <option value="kid">Kid</option>
//         </select>
//       </div>

      
//       <div className="addproduct-itemfield">
//         <label htmlFor="file-input">
//           <input  type="file" id='file-input' onChange={image_handler} style={{display:"none"}}/>
//           <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail' alt="" />
//         </label>
//         <input type="file" name='image' id='file-input' hidden/>
//       </div>
//         <button onClick={()=>{add_product()}} className='addproduct-button'>ADD</button>
//     </div>
//   )
// }

// export default AddProduct


import React, { useState } from 'react';
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    old_price: "",
    new_price: "",
    category: "women"
  });

  const image_handler = (e) => {
    setImage(e.target.files[0]);
  };

  const change_handler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const add_product = async () => {
    try {
      let responseData;
      let formData = new FormData();
      formData.append("product", image);
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      responseData = await response.json();

      if (responseData.success) {
        const product = {
          ...productDetails,
          image: responseData.image_url,
        };

        await fetch("http://localhost:4000/addproduct", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" // Correct content-type header
          },
          body: JSON.stringify(product),
        }).then((resp) => resp.json()).then((data) => {
          data.success ? alert("Product added") : alert("Failed to add product");
        });
      }
    } catch (error) {
      console.log("Error occurred while fetching", error);
    }
  };

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={change_handler} type="text" placeholder='Type here' name='name' />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={change_handler} type="text" name='old_price' placeholder='Type here' />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer</p>
          <input value={productDetails.new_price} onChange={change_handler} type="text" name='new_price' placeholder='Type here' />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={change_handler} name="category" className='addproduct-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <input type="file" id='file-input' onChange={image_handler} style={{ display: "none" }} />
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail' alt="" />
        </label>
        <input type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={add_product} className='addproduct-button'>ADD</button>
    </div>
  );
};

export default AddProduct;

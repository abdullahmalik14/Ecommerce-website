import React, { useState } from 'react'
import "./CSS/LoginSignup.css"
const LoginSignup = () => {
  const [state,setState] = useState("Log In")
  const [formatData,setFormatData] = useState({
    username:"",
    email:"",
    password:""
  })

  const login = async () => {
    try {
        const response = await fetch('http://localhost:4000/login', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formatData)
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace('/');
        } else {
            alert(responseData.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

  const signup =async ()=>{
      let responseData;
      await fetch('http://localhost:4000/signup',{
        method:"POST",
        headers:{
          Accept:"application/form-data",
          "content-type":"application/json"
        },
        body:JSON.stringify(formatData)
      }).then((res)=>res.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace('/')
      }else{
        alert(responseData.error)
      }
  }

  const change_handler=(e)=>{
    setFormatData({...formatData,[e.target.name]:e.target.value})
  
  }
  return (
    <div className='loginSignup'>
      <div className="login-signup-container">
        <h1>{state}</h1>
        <div className="login-signup-fields">
          {state==="Sign Up"? <input name='username' value={formatData.username} onChange={change_handler} type="text" placeholder='Your Name'/>:<></>}
          <input name='email' value={formatData.email} onChange={change_handler} type="email" placeholder='Email Address'/>
          <input name='password' value={formatData.password} onChange={change_handler} type="password" placeholder='Password' />
        </div>
        <button onClick={() => { state === "Log In" ? login() : signup() }}>Continue</button>
        {state==="Sign Up"? <p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Log In")}}>Login here</span></p>
        :<p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>
      }
       
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
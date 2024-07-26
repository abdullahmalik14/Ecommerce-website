const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors")


app.use(express.json());
app.use(cors());


// Database connection with mongodb
mongoose.connect("mongodb+srv://abdullahmalik14:Abdullah-786@mydb.llzg6lh.mongodb.net/?retryWrites=true&w=majority&appName=mydb")

//-----------------------------------Api creation--------------------------------------//
app.get("/", (req, res) => {
    res.send("Express App is running")
})

//image storage engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
});

//----------------------------------creating API for upload images-------------------------//
app.use('/images', express.static("upload/images"));

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: true,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
});

//---------------------------schema for creating products----------------------------------//

const Product = mongoose.model('product', {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

//--------------------------creating API for add products on databse-----------------------//

app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product_arr = products.slice(-1)
            let last_product = last_product_arr[0]
            id = last_product.id + 1
        } else {
            id = 1
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        console.log(product);
        await product.save();
        console.log("saved");
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error occurred while saving product:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
//------------------------------------creating API for remove products on databse--------------------//

app.post("/removeproduct", async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("removed");
    res.json({
        success: true,
        name: req.body.name
    })
})


// /creating API for getting all products 
app.get("/allproducts", async (req, res) => {
    let products = await Product.find({})
    console.log("All products Fetched");
    res.send(products);
})

//schema creating for user model

const Users = mongoose.model('Users', {
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//--------------------Creating endpoint(API) for registering the user--------------------------//

app.post("/signup", async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        res.status(400).json({ success: false, error: "Existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })

    await user.save()

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
})

//--------------------------------Creating Endpoint(API) for user login------------------------------//

app.post('/login', async(req,res)=>{
    let user = await Users.findOne({ email: req.body.email });
    if(user){
        const passCompare= req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,"secret_ecom")
            res.json({success:true,token})
        }
        else{
            res.json({success:false,error:"wromg password"})
        }
    }
    else{
        res.json({success:false,error:"Wrong email Id"})
    }

})


//-------------------creating end point(API) for new collection data----------------------------//
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({})
    let new_collection = products.slice(1).slice(-8)
    console.log("new collections Fetched");
    res.send(new_collection);
})

//-----------------------------creating endpoint for popular in women section--------------------//
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4)
    console.log("popular in women fetched");
    res.send(popular_in_women)

})


//creating middleware to fetch users---------------------------------------------//
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom'); 
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using a valid token" });
        }
    }
};

//-----------------------------creating endpoint for users cart data--------------------------------//
app.post('/addtocart',fetchUser, async(req,res) => {
         console.log("Added",req.body.itemId);
        let userData = await Users.findOne({ _id: req.user.id }); //Yh user ki id hai is mein user kapoora data milega
        // console.log(userData);
        userData.cartData[req.body.itemId] += 1;  //yh user ki id mein cartdata jo hga us mein jo item add hga us mein value +! increase krdi jayegi
        // console.log(userData.cartData[req.body.itemId]);
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });  //yh method phle user ki id ko find krke uske andr cartdata ko update karega 
        res.json({ message: "Added" });  //yh frontend pr response show hga 
    
})


//----------------------creating endpoint for remove product from cartdata------------//

app.post("/removefromcart",fetchUser,async(req,res)=>{
    
        console.log("remove",req.body.itemId);
        let userData = await Users.findOne({ _id: req.user.id });
        if(userData.cartData[req.body.itemId]>0)
        userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ message: "removed" }); 
 
})

//creating endpoint(API) for getting previous cartdata

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("get cart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData)

})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on this port " + port);
    }
    else {
        console.log("Error" + error);
    }
})
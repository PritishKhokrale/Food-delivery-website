const express = require('express');
const path = require("path");
const bcrypt =require("bcrypt");
const customerModel=require("./customer");
const restaurantModel=require("./restaurant");
const orderModel=require("./order");
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');

var secretkey = "BcdeFghijklmnopqrstuvwxyzABCDEfghijklmnopqr";
async function hashpassword(password) {
  var result = await bcrypt.hash(password, 10);
  return result;  
};

async function comparepassword(userpassword, hashedpassword) {
  var result = await bcrypt.compare(userpassword, hashedpassword);
  return result;
};
// convert data into json format
app.use(cookieParser()); 
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs');

app.use(express.static("public"));
app.get("/login", (req, res) =>{
res.render("login");
});


app.get("/", (req,res) =>{
  res.render("signup");
});
app.get("/home", isAuthenticated1, (req,res) =>{
  res.render("home");
});
app.get("/menu", isAuthenticated1, (req,res) =>{
  res.render("menu");
});

app.get("/categories", isAuthenticated1,(req,res)=>{
res.render("categories");
});
app.get("/cancelled", isAuthenticated2, async (req,res)=>{
  var {username}=jwt.verify(req.cookies.restaurant,secretkey);
  var order=[];
  var order=await orderModel.find({restaurant_username:username});
  res.render("cancelled",{order});
  });
  app.get("/completed",isAuthenticated2, async(req,res)=>{
    var {username}=jwt.verify(req.cookies.restaurant,secretkey);
    var order=[];
    var order=await orderModel.find({restaurant_username:username});
    res.render("completed",{order});
    });
      

app.get("/order", isAuthenticated1,async (req,res)=>{
  var {username}=jwt.verify(req.cookies.customer,secretkey);
    var order=[];
    var order=await orderModel.find({customer_username:username});
  var restaurants=[];
  var restaurants=await restaurantModel.find({domain:"restaurant"});
    var restaurants_usernames=restaurants.map(e=>e.username);
    res.render('order',{restaurants_usernames,order});
  
  });
  app.get("/restaurant", isAuthenticated2,async (req,res)=>{
    var {username}=jwt.verify(req.cookies.restaurant,secretkey);
    var order=[];
    var order=await orderModel.find({restaurant_username:username});
      res.render('restaurant',{order});
    });
  
//register user
//login user

app.post('/signup', async (req, res) => {

  try {
    //to check all the credentials are filled or not  
    if (!req.body.username || !req.body.password || !req.body.domain) {
      throw new Error("Username, password, and domain are required.");
    }

    //to check if there is already a user with same username
    var check1;
    var check2;
    if (req.body.domain === "customer") {
      check1 = await customerModel.findOne({ username: req.body.username });
    }
    else if (req.body.domain === "restaurant") {
      check2 = await restaurantModel.findOne({ username: req.body.username })
    }
    if (check1) {
      throw new Error("username already exists in customers,pls try different username.");
    }
    if (check2) {
      throw new Error("username already exists in Restaurant, pls try different username.");
    }
    
    if(req.body.password.length < 8){
      throw new Error("password should be of minimum 8 characters.");
    }

    if (req.body.domain === "customer") {

      var customerdata = {
        username: req.body.username,
        password: await hashpassword(req.body.password),
        domain: req.body.domain
      };
      var customer = await customerModel.create(customerdata);

      var webtoken = jwt.sign({ username: req.body.username, domain: req.body.domain, customerid: customer._id }, secretkey);

      await customerModel.updateOne({ _id: customer._id }, { token: webtoken });

    }
    else if (req.body.domain === "restaurant") {

      var webtoken = jwt.sign({ username: req.body.username, domain: req.body.domain }, secretkey);

      var restaurantdata = {
        username: req.body.username,
        password: await hashpassword(req.body.password),
        domain: req.body.domain,
        token: webtoken
      };
      await restaurantModel.create(restaurantdata);
    }
    res.redirect('/login');
  } catch (error) {
    res.render('signup', { err: error.message })
    console.log(error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    //to check all the credentials are filled or not  
    if (!req.body.username || !req.body.password || !req.body.domain) {
      throw new Error("Username, password, and domain are required.");
    }

    //to check if the user exists and if exists then redirect to respective profile pages
    var scan1;
    var scan2;
    var scan3;
    var scan4;
    if (req.body.domain === "customer") {
      scan1 = await customerModel.findOne({ username: req.body.username });

      if (scan1) {
        scan3 = await comparepassword(req.body.password, scan1.password);
      }
      else if (!scan1) {
        throw new Error("wrong username of Customer");
      }

      if (scan3) {
        res.cookie('customer', scan1.token, { maxAge: 1800000, httpOnly: true });

        res.redirect('/home');
      }
      else if (!scan3) {
        throw new Error("wrong password");
      }
    }
    else if (req.body.domain === "restaurant") {
      scan2 = await restaurantModel.findOne({ username: req.body.username });

      if (scan2) {
        scan4 = await comparepassword(req.body.password, scan2.password);
      }
      else if (!scan2) {
        throw new Error("wrong username of Restaurant");
      }

      if (scan4) {
        res.cookie('restaurant', scan2.token, { maxAge: 1800000, httpOnly: true });

        res.redirect('/restaurant');
      }
      else if (!scan4) {
        throw new Error("wrong password");
      }
    }


  }
  catch (error) {
    res.render('login', { err: error.message });
    console.log(error.message);
  }
});

app.post('/sendmessage', isAuthenticated1, async(req,res)=>{
  var {username}=jwt.verify(req.cookies.customer,secretkey);
   var message =await orderModel.create(
    {
      customer_username:username,
      restaurant_username:req.body.restaurant_username,
      order:req.body.order,
      Address:req.body.Address,
      contact:req.body.contact,
      payment:req.body.payment,
    }
    );
    res.redirect('/order');
})


app.get('/accept', async (req, res) => {
    try {
        const orderId = req.query.id; 
        if (orderId) {
            await orderModel.findByIdAndUpdate(orderId, { message_status: 'accepted' }); 
            res.redirect('/restaurant'); // Redirect back to the orders page or wherever is appropriate
        } else {
            res.status(400).send('Invalid order ID');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Reject order
app.get('/reject', async (req, res) => {
    try {
        const orderId = req.query.id;
        if (orderId) {
            await orderModel.findByIdAndUpdate(orderId, { message_status: 'rejected' }); // Update the order status
            res.redirect('/restaurant'); // Redirect back to the orders page or wherever is appropriate
        } else {
            res.status(400).send('Invalid order ID');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});






function isAuthenticated1(req, res, next) {
  var customercookie = req.cookies.customer;
  if (customercookie) {
    console.log("customer cookie found");
    try {
      console.log("customer cookie founded is", customercookie);
      var verification = jwt.verify(customercookie, secretkey);
      console.log("customer verification done", verification);
      if (verification) {
        console.log("customer authenticated");
        return next();
      }
      else {
        throw new Error("You do not have access to this domain");
      }
    }
    catch (error) {
      console.error("Verification error:", error.message);
      res.clearCookie('customer');
      return res.redirect('/login');
    }
  }
  else {
    return res.redirect('/login');
  }
};

function isAuthenticated2(req, res, next) {
  var restaurantcookie = req.cookies.restaurant;
  if (restaurantcookie) {
    console.log("restaurant cookie found");
    try {
      console.log("restaurant cookie founded is", restaurantcookie);
      var verification = jwt.verify(restaurantcookie, secretkey);
      console.log("restaurant verification done", verification);
      if (verification) {
        console.log("restaurant authenticated");
        return next();
      }
      else {
        throw new Error("You do not have access to this domain");
      }
    }
    catch (error) {
      console.error("Verification error:", error.message);
      res.clearCookie('restaurant');
      return res.redirect('/login');
    }
  }
  else {
    return res.redirect('/login');
  }
};

const port =  3000 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


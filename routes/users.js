var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");
const jwt = require("jsonwebtoken");

// //midleware functions
// function verifyToken(req,res,next){
//   const auth = req.cookies.access_token;
//   if(!auth){
//     res.redirect('/login',{message:'incorrect token'})
//   }else{
//     const token = auth.split(" ").pop()
//     jwt.verify(token,"secret",(err,decode)=>{
//       if(!err) {
//         let id = jwt.verify(auth.split(" ")[0], "secret")
//         next()
//         return id.id
//       }ser
//       else{
//         res.redirect('/login')
//       }
//     })
//   }
// }


//latest middleware for jwt

function verifyToken(req,res,next){
  const authcookie = req.cookies.authcookie
  jwt.verify(authcookie,"secret_key",(err,data)=>{
    console.log(data)
    if(err){
      res.sendStatus(403)
    } 
    else if(data){
     req.user = data

      next()
   }
  })
}

/* GET users listing. */
router.get("/", verifyToken,function (req, res, next) {
  productHelpers.getAllProduct().then((products) => {
    console.log(req.user)
    res.render("user/home", { user: true, products });
  });
});

router.get("/login", (req, res) => {
  res.render("user/login", { user: true ,});
});

router.get("/signup", (req, res) => {
  res.render("user/register", { user: true });
});

// router.post('/signup',(req,res)=>{
//   userHelper.doSignup(req.body).then((userId)=>{
//     let userObj = {
//       id : userId,
//     }
//     let token = jwt.sign(userObj,"secret",{expiresIn:60})
//     res
//     .cookie("access_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//     })
//     .redirect('/')
//   })
// })

// router.post("/login", (req, res) => {
//   userHelper.doLogin(req.body).then((response) => {
//     if(response.user === false){
//       req.session.loggedErr = 'no user found'
//       res.redirect('/login')
//     }else if(response.password === true){
//       req.session.loggedIn = true
//       req.session.user = response.user
//       res.redirect('/')
//     }else if(response.password === false){
//       res.redirect('/login')
//     }
//   });
// });

router.post("/login",(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.password === true){
      let user = {
        username:response.user.name,
        id:response.user._id
      }
      req.session.user = response.user
      const token = jwt.sign(user,'secret_key')
      res.cookie('authcookie',token,{maxAge:900000,httpOnly:true}).redirect('/')

    }
  })
})

module.exports = router;

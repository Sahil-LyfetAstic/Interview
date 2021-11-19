var express = require("express");
var router = express.Router();
const productHelper = require("../helpers/productHelpers");
const admin = true;

/* GET home page. */
router.get("/", function (req, res, next) {
  productHelper.getAllProduct().then((products)=>{
    res.render("admin/view-product", { admin,products });
  })
});

router.get("/add-products", (req, res) => {
  res.render("admin/add-product", { admin });
});

router.post("/add-products", (req, res) => {
  let image = req.files.image;
  productHelper.addProduct(req.body).then((proId) => {
    image.mv("./public/product-image/" + proId + ".jpeg", (err) => {
      if (!err) res.render("admin/add-product",{admin});
    });
  });
});

module.exports = router;

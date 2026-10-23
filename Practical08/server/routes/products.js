const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");

function validateProduct(req, res, next) {
  const { name, price } = req.body;
  if (!name || price === undefined || isNaN(Number(price))) {
    return res.status(400).json({ error: "name and a numeric price are required" });
  }
  next();
}

router.get("/", ctrl.getProducts);
router.post("/", validateProduct, ctrl.createProduct);
router.delete("/:id", ctrl.deleteProduct);

module.exports = router;

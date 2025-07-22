// routes/products.js
const express = require("express");
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes (opsional)
router.get("/", productController.getAllProducts);
router.get("/search", productController.getProductsWithFilter);
router.get("/:id", productController.getProduct);

// Protected routes (require login)
router.post("/", authenticateToken, productController.createProduct);
router.put("/:id", authenticateToken, productController.updateProduct);
router.delete("/:id", authenticateToken, productController.deleteProduct);

module.exports = router;

// controllers/productController.js - Clean version for MySQL
const prisma = require("../lib/prisma");

// Get products with search and pagination - FIXED for MySQL
const getProductsWithFilter = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // MySQL doesn't support mode: "insensitive"
    // Use contains, startsWith, or endsWith instead
    const whereClause = search
      ? {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              name: {
                contains: search.toLowerCase(),
              },
            },
            {
              name: {
                contains: search.toUpperCase(),
              },
            },
            {
              name: {
                startsWith: search,
              },
            },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limitNumber,
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    // Convert Decimal to number
    const productsWithPriceAsNumber = products.map((product) => ({
      ...product,
      price: parseFloat(product.price),
    }));

    const response = {
      products: productsWithPriceAsNumber,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for JSON response
    const productsWithPriceAsNumber = products.map((product) => ({
      ...product,
      price: parseFloat(product.price),
    }));

    res.json(productsWithPriceAsNumber);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Convert Decimal to number
    const productWithPriceAsNumber = {
      ...product,
      price: parseFloat(product.price),
    };

    res.json(productWithPriceAsNumber);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Name is required and must be a valid string" });
    }

    if (!price || isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ error: "Price is required and must be a positive number" });
    }

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res
        .status(400)
        .json({ error: "Stock is required and must be a non-negative number" });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
      },
    });

    // Convert Decimal to number
    const productWithPriceAsNumber = {
      ...product,
      price: parseFloat(product.price),
    };

    res.status(201).json(productWithPriceAsNumber);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Name is required and must be a valid string" });
    }

    if (!price || isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ error: "Price is required and must be a positive number" });
    }

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res
        .status(400)
        .json({ error: "Stock is required and must be a non-negative number" });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
      },
    });

    // Convert Decimal to number
    const productWithPriceAsNumber = {
      ...product,
      price: parseFloat(product.price),
    };

    res.json(productWithPriceAsNumber);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsWithFilter,
};

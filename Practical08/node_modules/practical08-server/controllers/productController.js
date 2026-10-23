// In-memory data + request handlers for /api/products (protected route)
let products = [
  { id: 1, name: "Keyboard", price: 1200 },
  { id: 2, name: "Mouse", price: 600 },
];
let nextId = 3;

exports.getProducts = (req, res) => res.json(products);

exports.createProduct = (req, res) => {
  const { name, price } = req.body;
  const product = { id: nextId++, name, price: Number(price) };
  products.push(product);
  res.status(201).json(product);
};

exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }
  const [removed] = products.splice(index, 1);
  res.json({ message: "Product deleted", product: removed });
};

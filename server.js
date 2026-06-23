// ===== DealBuddy Backend — Express Server =====
// Run with: node server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample product data (simulating a database)
let products = [
  { id: 1, title: "Apple AirPods Pro 3", price: 180, originalPrice: 249, savings: 69, retailer: "Amazon", category: "electronics", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop", rating: { rate: 4.7, count: 120 } },
  { id: 2, title: "MacBook Air M5", price: 949, originalPrice: 1099, savings: 150, retailer: "Amazon", category: "computers", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop", rating: { rate: 4.8, count: 85 } },
  { id: 3, title: "Logitech MX Master 3S", price: 89.99, originalPrice: 119.99, savings: 30, retailer: "Amazon", category: "electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop", rating: { rate: 4.6, count: 200 } },
  { id: 4, title: 'Samsung 65" Crystal UHD 4K TV', price: 329.99, originalPrice: 469.99, savings: 140, retailer: "Best Buy", category: "electronics", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=200&fit=crop", rating: { rate: 4.5, count: 150 } },
  { id: 5, title: 'Samsung The Frame 65" TV', price: 1199.99, originalPrice: 1599.99, savings: 400, retailer: "Best Buy", category: "electronics", image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300&h=200&fit=crop", rating: { rate: 4.9, count: 60 } },
  { id: 6, title: 'Samsung 65" QLED 4K Smart TV', price: 599.99, originalPrice: 899.99, savings: 300, retailer: "Best Buy", category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop", rating: { rate: 4.4, count: 90 } }
];

let nextId = 7;

// ===== ROUTES =====

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DealBuddy API is running! 🛍', version: '1.0' });
});

// GET all products
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
  }

  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating.rate - a.rating.rate);
  }

  res.json({ count: filtered.length, products: filtered });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// GET categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { title, price, originalPrice, savings, retailer, category, image, rating } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price are required' });
  }

  const newProduct = {
    id: nextId++,
    title,
    price,
    originalPrice: originalPrice || price,
    savings: savings || 0,
    retailer: retailer || 'DealBuddy',
    category: category || 'general',
    image: image || 'https://via.placeholder.com/300x200',
    rating: rating || { rate: 4.5, count: 0 }
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body, id: products[index].id };
  res.json(products[index]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'Deleted', product: deleted[0] });
});

// Newsletter subscribe
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  res.json({ message: `Subscribed ${email} successfully! 🎉` });
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }
  res.json({ message: `Message from ${name} received! ✅` });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   DealBuddy API Server Running! 🛍   ║
  ║   http://localhost:${PORT}              ║
  ╠═══════════════════════════════════════╣
  ║   GET    /api/products               ║
  ║   GET    /api/products/:id           ║
  ║   GET    /api/categories             ║
  ║   POST   /api/products               ║
  ║   PUT    /api/products/:id           ║
  ║   DELETE /api/products/:id           ║
  ║   POST   /api/subscribe              ║
  ║   POST   /api/contact                ║
  ╚═══════════════════════════════════════╝
  `);
});

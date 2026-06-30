
const express = require('express');  
const cors = require('cors');  
const app = express();  
const PORT = process.env.PORT || 3001;

app.use(cors());  
app.use(express.json());

let products = [  
  { id: 1, title: "Apple AirPods Pro 3", price: 180, originalPrice: 249, savings: 69, retailer: "Amazon", category: "electronics", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop", rating: { rate: 4.7, count: 120 } },  
  { id: 2, title: "MacBook Air M5", price: 949, originalPrice: 1099, savings: 150, retailer: "Amazon", category: "computers", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop", rating: { rate: 4.8, count: 85 } },  
  { id: 3, title: "Logitech MX Master 3S", price: 89.99, originalPrice: 119.99, savings: 30, retailer: "Amazon", category: "electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop", rating: { rate: 4.6, count: 200 } },  
  { id: 4, title: 'Samsung 65" Crystal UHD 4K TV', price: 329.99, originalPrice: 469.99, savings: 140, retailer: "Best Buy", category: "electronics", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=200&fit=crop", rating: { rate: 4.5, count: 150 } },  
  { id: 5, title: 'Samsung The Frame 65" TV', price: 1199.99, originalPrice: 1599.99, savings: 400, retailer: "Best Buy", category: "electronics", image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300&h=200&fit=crop", rating: { rate: 4.9, count: 60 } },  
  { id: 6, title: 'Samsung 65" QLED 4K Smart TV', price: 599.99, originalPrice: 899.99, savings: 300, retailer: "Best Buy", category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop", rating: { rate: 4.4, count: 90 } }  
];  
let nextId = 7;

app.get('/', (req, res) => res.json({ message: 'DealBuddy API Running!', version: '1.0' }));

app.get('/api/products', (req, res) => {  
  const { category, search, sort } = req.query;  
  let filtered = [...products];  
  if (category) filtered = filtered.filter(p => p.category === category);  
  if (search) { const t = search.toLowerCase(); filtered = filtered.filter(p => p.title.toLowerCase().includes(t)); }  
  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);  
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);  
  else if (sort === 'rating') filtered.sort((a, b) => b.rating.rate - a.rating.rate);  
  res.json({ count: filtered.length, products: filtered });  
});

app.get('/api/products/:id', (req, res) => {  
  const product = products.find(p => p.id === parseInt(req.params.id));  
  if (!product) return res.status(404).json({ error: 'Not found' });  
  res.json(product);  
});

app.get('/api/categories', (req, res) => {  
  res.json([...new Set(products.map(p => p.category))]);  
});

app.post('/api/products', (req, res) => {  
  const { title, price, originalPrice, savings, retailer, category, image, rating } = req.body;  
  if (!title || !price) return res.status(400).json({ error: 'Title and price required' });  
  const np = { id: nextId++, title, price, originalPrice: originalPrice || price, savings: savings || 0, retailer: retailer || 'DealBuddy', category: category || 'general', image: image || 'https://via.placeholder.com/300x200', rating: rating || { rate: 4.5, count: 0 } };  
  products.push(np);  
  res.status(201).json(np);  
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

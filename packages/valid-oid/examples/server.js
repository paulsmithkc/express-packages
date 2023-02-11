require('dotenv').config();

const express = require('express');
const mongodb = require('mongodb');
const validId = require('../dist/index.js');

// create application
const app = express();

// data
const products = [
  { _id: new mongodb.ObjectId(), name: 'Product 1' },
  { _id: new mongodb.ObjectId(), name: 'Product 2' },
  { _id: new mongodb.ObjectId(), name: 'Product 3' },
];
console.log('products', products);
const getProductById = (productId) => {
  return products.find((product) => product._id.equals(productId));
};

// routes
app.get('/', (_req, res) => {
  return res.redirect('/api/product/list');
});
app.get('/api/product/list', (_req, res) => {
  return res.json(products);
});
app.get('/api/product/id/:productId', validId('productId'), (req, res) => {
  const productId = req.productId;
  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product "${productId}" not found.` });
  } else {
    return res.json(product);
  }
});

// error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(err.status || 500).json({ error: err });
});

// start application
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}`);
});

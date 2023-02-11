require('dotenv').config();

const express = require('express');
const { ObjectId } = require('mongodb');
const validId = require('../index');

// create application
const app = express();

// data
const products = [
  { _id: new ObjectId(), name: 'Product 1' },
  { _id: new ObjectId(), name: 'Product 2' },
  { _id: new ObjectId(), name: 'Product 3' },
];
const getProductById = (productId) => {
  return products.find((product) => product._id.equals(productId));
};

// routes
app.get('/', (req, res) => {
  return res.redirect('/api/product/list');
});
app.get('/api/product/list', (req, res) => {
  return res.json(products);
});
app.get(
  '/api/product/id/:productId',
  validId('productId'),
  (req, res, next) => {
    const productId = req.productId;
    const product = getProductById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product "${productId}" not found.` });
    } else {
      return res.json(product);
    }
  }
);

// start application
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}`);
});

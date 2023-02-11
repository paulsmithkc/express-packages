require('dotenv').config();

const express = require('express');
const Joi = require('joi');
const mongodb = require('mongodb');
const validRequest = require('../dist/index.js');

// create application
const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
const updateProduct = (productId, update) => {
  const product = products.find((p) => p._id.equals(productId));
  if (product) {
    for (const key in update) {
      product[key] = update[key];
    }
  }
};

// schema
const getProductSchema = {
  params: Joi.object({
    productId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/, 'ObjectId')
      .required(),
  }),
};
const updateProductSchema = {
  params: Joi.object({
    productId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/, 'ObjectId')
      .required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    price: Joi.number().min(0).precision(2).required(),
  }),
};

// routes
app.get('/', (req, res) => {
  return res.redirect('/api/product/list');
});
app.get('/api/product/list', (req, res) => {
  return res.json(products);
});
app.get('/api/product/:productId', validRequest(getProductSchema), (req, res) => {
  const productId = new mongodb.ObjectId(req.params.productId);
  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product "${productId}" not found.` });
  } else {
    return res.json(product);
  }
});
app.post('/api/product/:productId', validRequest(updateProductSchema), (req, res, next) => {
  const productId = new mongodb.ObjectId(req.params.productId);
  const update = req.body;

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product ${productId} not found!` });
  } else {
    updateProduct(productId, update);
    return res.json({ success: 'Product Updated!' });
  }
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.status || 500).json({ error: err });
});

// start application
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}`);
});

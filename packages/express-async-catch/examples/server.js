require('dotenv').config();

const express = require('express');
const asyncCatch = require('../dist/index.js');

// create application
const app = express();

// data
const products = [
  { _id: 1, name: 'Product 1' },
  { _id: 2, name: 'Product 2' },
  { _id: 3, name: 'Product 3' },
];
const getProducts = async () => products;
const getProductsWithAsyncError = async () => {
  throw new Error('Forced promise rejection.');
};
const getProductsWithSyncError = () => {
  throw new Error('Forced thrown error.');
};

// routes
app.get('/', (req, res) => {
  return res.redirect('/api/product/list');
});
app.get(
  '/api/product/list',
  asyncCatch(async (req, res) => {
    return res.json(await getProducts());
  })
);
app.get(
  '/api/product/list/async-error',
  asyncCatch(async (req, res) => {
    return res.json(await getProductsWithAsyncError());
  })
);
app.get(
  '/api/product/list/sync-error',
  asyncCatch(async (req, res) => {
    return res.json(await getProductsWithSyncError());
  })
);

// start application
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}`);
});

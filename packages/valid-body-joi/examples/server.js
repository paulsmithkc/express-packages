require('dotenv').config();

const express = require('express');
const Joi = require('joi');
const validBody = require('../dist/index.js');

// create application
const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// schema
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().required(),
});

// routes
app.post('/api/auth/login', validBody(loginSchema), (req, res, next) => {
  const login = req.body;
  if (login.email === 'admin@example.com' && login.password === 'password') {
    return res.json({ success: 'Credentials Accepted!' });
  } else {
    return res.json({ error: 'Credentials Rejected!' });
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

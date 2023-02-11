require('dotenv').config();

const express = require('express');
const z = require('zod');
const validBody = require('../dist/index.js');

// create application
const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// schema
const loginSchema = z.object({
  email: z.string().transform((x) => x?.toLowerCase()?.trim()),
  password: z.string().transform((x) => x?.trim()),
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

// start application
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://${hostname}:${port}`);
});

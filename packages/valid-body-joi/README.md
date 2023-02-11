# valid-body-joi
Express middleware for validating the request body with Joi.

## Install
```bash
npm install valid-body-joi
```

## Usage
Import the middleware and Joi as below:
```js
const validBody = require('valid-body-joi');
const Joi = require('joi');
```

Define a schema:
```js
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().required(),
});
```

Install the middleware on a route:
```js
app.post('/api/auth/login', validBody(loginSchema), (req, res, next) => {
  const login = req.body;
  // ... 
});
```

## Implementation
1. The middleware validates the request body against the provided schema.

2. If the request body is valid, the body is replaced by the sanitized data, and control passes to the next middleware.

3. Otherwise, a 400 response is sent.

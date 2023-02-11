# valid-request-joi

Express middleware for validating the request with Joi.

## Install

```bash
npm install valid-request-joi
```

## Usage

Import the middleware and Joi as below:

```js
const validRequest = require('valid-request-joi');
const Joi = require('joi');
```

Define a schema:

```js
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
```

Install the middleware on a route:

```js
app.post('/api/product/:productId', validRequest(updateProductSchema), (req, res, next) => {
  const productId = req.params.productId;
  const update = req.body;
  // ...
});
```

## Implementation

1. The middleware validates the chosen parts of the request against the provided schemas.

2. If the request is valid, the request is updated with the sanitized data, and control passes to the next middleware.

3. Otherwise, a 400 response is sent.

# valid-request-zod

Express middleware for validating the request with Zod.

## Install

```bash
npm install valid-request-zod
```

## Usage

Import the middleware and Zod as below:

```js
const validRequest = require('valid-request-zod');
const z = require('zod');
```

Define a schema:

```js
const updateProductSchema = {
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  }),
  body: z.object({
    name: z.string().transform((x) => x?.trim()),
    category: z.string().transform((x) => x?.trim()),
    price: z.number().min(0).multipleOf(0.01),
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

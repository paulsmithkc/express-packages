# valid-oid
Express middleware for validating an ObjectId in the path.

## Install
```bash
npm install valid-oid
```

## Usage
Import the middleware as below:
```js
const validId = require('valid-oid');
```

Install the middleware on a route:
```js
app.get('/api/product/:productId', validId('productId'), (req, res, next) => {
  const productId = req.productId;
  const product = getProduct(productId);
  if (!product) {
    return res.status(404).json({ error: `Product "${productId}" not found.` });
  } else {
    return res.json(product);
  }
});
```

## Implementation
1. The middleware looks for a path param with the provided name.

2. If the param exists and is valid, the validated ObjectId is added to the request, and control passes to the next middleware.

3. Otherwise, a 404 response is sent.

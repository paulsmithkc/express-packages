# valid-body-zod

Express middleware for validating the request body with Zod.

## Install

```bash
npm install valid-body-zod
```

## Usage

Import the middleware and Zod as below:

```js
const validBody = require('valid-body-zod');
const z = require('zod');
```

Define a schema:

```js
const loginSchema = z.object({
  email: z.string().transform((x) => x?.trim()?.toLowerCase()),
  password: z.string().transform((x) => x?.trim()),
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

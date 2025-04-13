const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Configure the JWT check middleware
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,                 // cache the signing key
    rateLimit: true,             // rate limit the calls to the JWKS endpoint
    jwksRequestsPerMinute: 5,    // maximum number of requests per minute
    jwksUri: `https://login.microsoftonline.com/${process.env.TENANT_ID}/discovery/v2.0/keys`
  }),
  // Validate the audience and the issuer.
  audience: `api://${process.env.CLIENT_ID}`, // Ensure this matches the API URI exposed in Azure
  issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`,
  algorithms: ['RS256']
});

// Protected route — requires a valid Entra ID (Azure AD) token.
app.get('/api/hello', checkJwt, (req, res) => {
  // The middleware attaches the decoded token to req.auth
  // You can access token details (like preferred_username or name) from req.auth.
  res.send({ message: `Hello ${req.auth.preferred_username || 'User'}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
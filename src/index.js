const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());
//
const passport = require('passport');
const { BearerStrategy } = require('passport-azure-ad');

// Use environment variables for sensitive configuration
const options = {
    identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.CLIENT_ID,
    audience: `api://${process.env.CLIENT_ID}`, // Assuming your audience matches your client ID.
    validateIssuer: true,
    loggingLevel: 'info',
    passReqToCallback: false
};

passport.use(new BearerStrategy(options, (token, done) => {
    // For this demo, we simply pass the token on.
    return done(null, token, null);
}));

app.use(passport.initialize());

// Protected route — requires a valid Azure AD token.
app.get('/api/hello',
    passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        res.send({ message: `Hello ${req.user.name || 'User'}` });
    }
);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

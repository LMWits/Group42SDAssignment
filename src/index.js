const express = require('express');
// const msal = require('@azure/msal-node');
const app = express();
const port = 8080;

// Middleware to parse JSON
app.use(express.json());
// ec18Q~95KsccufnWZowhB4-11ebPDx4_bidI1a09
// MSAL configuration

const passport = require('passport');
const { BearerStrategy } = require('passport-azure-ad');

const options = {
    identityMetadata: `https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/v2.0/.well-known/openid-configuration`,
    clientID: 'd2a761e2-846c-453f-ada6-d1a7144ed0bf',
    audience: 'api://d2a761e2-846c-453f-ada6-d1a7144ed0bf',
    validateIssuer: true,
    loggingLevel: 'info',
    passReqToCallback: false
};

passport.use(new BearerStrategy(options, (token, done) => {
    return done(null, token, null);
}));

app.use(passport.initialize());

// Protected route
app.get('/api/hello', passport.authenticate('oauth-bearer', { session: false }), (req, res) => {
    res.send({ message: `Hello ${req.user.name}` });
});

// const msalConfig = {
//     auth: {
//         clientId: 'd2a761e2-846c-453f-ada6-d1a7144ed0bf', // Replace with your Azure AD App's Client ID
//         authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your Azure AD Tenant ID
//         clientSecret: 'Y52b92478-47e6-4e1c-b4e9-f12a180f357a'
//     }
// };
// //test pipeline
// const cca = new msal.ConfidentialClientApplication(msalConfig);

// // API Endpoints
// // http://localhost:3000/api/hello
// // 1. GET /api/hello
// app.get('/api/hello', (req, res) => {
//     res.send({ message: 'Hello, World!' });
// });

// // 2. POST /api/echo
// app.post('/api/echo', (req, res) => {
//     const { message } = req.body;
//     res.send({ echoedMessage: message });
// });

// // 3. GET /api/goodbye
// app.get('/api/goodbye', (req, res) => {
//     res.send({ message: 'Goodbye, World!' });
// });

// // 4. POST /api/register
// app.post('/api/register', async (req, res) => {
//     const { username, password } = req.body;

//     // Simulate user registration logic (e.g., saving to a database)
//     // In a real-world scenario, you would integrate with Azure AD B2C or another identity provider
//     res.send({ message: `User ${username} registered successfully.` });
// });

// // 5. POST /api/login
// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;

//     const authParams = {
//         scopes: ['api://YOUR_API_SCOPE/.default'], // Replace with your API scope
//         username,
//         password
//     };

//     try {
//         const authResponse = await cca.acquireTokenByUsernamePassword(authParams);
//         res.send({ accessToken: authResponse.accessToken });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(401).send({ error: 'Invalid credentials' });
//     }
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
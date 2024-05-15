const jwt = require('jsonwebtoken');

// Secret key for signing JWT tokens
const JWT_SECRET = 'SECRET_KEY'; // You should keep this secret key secure, preferably in environment variables

// Middleware to authenticate JWT tokens
const jwtAuthMiddleware = (req, res, next) => {
    // Extract token from headers, query parameters, or cookies
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // If token is valid, attach the decoded payload to the request object
        req.user = decoded;
        next();
    });
};

// Function to generate JWT token
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Example usage
// const user = { id: 123, username: 'example_user' };
// const token = generateToken(user);
// console.log('Generated JWT token:', token);

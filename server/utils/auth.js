const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken library for token operations
const { GraphQLError } = require('graphql'); // Importing GraphQLError from GraphQL for error handling

// Set token secret and expiration date
const secret = 'mysecretsshhhhh'; // Secret key used for signing and verifying tokens
const expiration = '2h'; // Expiration time for the token

module.exports = {
  // Define an AuthenticationError object to handle authentication failures
  AuthenticationError: new GraphQLError('Could not authenticate user.', { 
    extensions: {
      code: 'UNAUTHENTICATED', // Extension code for identifying authentication errors
    },
  }),
  // Middleware function for handling authenticated routes
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Extract the token value from the authorization header if it exists
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If token doesn't exist, return the request object
    if (!token) {
      return req;
    }

    // Verify token and extract user data from it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration }); // Verify token using the secret key
      req.user = data; // Set the user data in the request object
    } catch {
      console.log('Invalid token'); // Log error message if token verification fails
    }

    // Return the request object to be passed to the resolver as `context`
    return req;
  },
  // Function for signing a new token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id }; // Payload containing user data for the token

    // Sign the token with the payload, secret key, and expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

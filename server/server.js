// Import necessary modules
const express = require('express'); // Import Express.js for server setup
const path = require('path'); // Import path module for working with file and directory paths
const db = require('./config/connection'); // Import database connection module

const { ApolloServer } = require('@apollo/server'); // Import ApolloServer class from Apollo Server
const { expressMiddleware } = require('@apollo/server/express4'); // Import expressMiddleware from Apollo Server for Express integration
const { typeDefs, resolvers } = require('./schemas'); // Import GraphQL type definitions and resolvers

const { authMiddleware } = require('./utils/auth'); // Import authentication middleware

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3001; // Define the port for the server

// Create a new Apollo Server instance with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Asynchronous function to start the Apollo Server
const startApolloServer = async () => {
  await server.start(); // Start the Apollo Server

  // Middleware for parsing URL-encoded and JSON request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Middleware to integrate Apollo Server with Express
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware, // Pass the authentication middleware to the context
  }));

  // Serve the client's static files in production mode
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'))); // Serve static files from the 'client/dist' directory

    // Route to serve the index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html')); // Send the index.html file as the response
    });
  }

  // Once the database connection is open, start the server
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`)); // Start listening for requests on the defined port
  });
}

// Call the asynchronous function to start the Apollo Server
startApolloServer();
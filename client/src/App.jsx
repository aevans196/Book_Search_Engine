// Import the CSS file for styling
import './App.css';

// Import necessary components from React Router DOM
import { Outlet } from 'react-router-dom';

// Import necessary Apollo Client libraries
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Import Navbar component
import Navbar from './components/Navbar';

// Construct the main GraphQL API endpoint using createHttpLink
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware to attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach the token as a Bearer token
    },
  };
});

// Create a new ApolloClient instance with the configured link and cache
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Set up the client to execute the `authLink` middleware
  cache: new InMemoryCache(), // Use an in-memory cache
});

// Define the main App component
function App() {
  return (
    // Provide the ApolloClient instance to the entire application using ApolloProvider
    <ApolloProvider client={client}>
      {/* Render the Navbar component */}
      <Navbar />
      {/* Render the Outlet component to handle nested routes */}
      <Outlet />
    </ApolloProvider>
  );
}

// Export the App component as the default export
export default App;
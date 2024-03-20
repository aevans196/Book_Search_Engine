import './App.css';
import { Outlet } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

import Navbar from './components/Navbar';

const auth = setContext((_, {headers}) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})
const httpLink = createHttpLink({uri: '/graphql'});
const client = new ApolloClient({
  link: auth.concat(httpLink),
  cache: new InMemoryCache(),
});
function App() {
  return (
   
      <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
      </ApolloProvider >
   
  );
}

export default App;
// Import the gql function from the Apollo Client library
import { gql } from '@apollo/client';

// Define a GraphQL query to retrieve user information, including saved books
// This query requires the user's ID as an input parameter
// It returns the user's ID, username, email, book count, and an array of saved books
export const QUERY_GET_ME = gql`
query me ($_id: ID!) {
    me(userId: $_id) {
        _id
        email
        username
        savedBooks {
            authors
            bookId
            description
            image
            link
            title
        }
    }
}`
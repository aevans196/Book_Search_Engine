import {gql} from '@apollo/client'
// Define a GraphQL mutation for logging in a user
// This mutation takes email and password as input parameters
// It returns a token and user information if the login is successful
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// Define a GraphQL mutation for adding a new user
// This mutation takes username, email, and password as input parameters
// It returns a token and user information if the user is successfully added
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    authors
                    bookId
                    image
                    link
                    title
                    description
                }
            }
        }
    }
`;

// Define a GraphQL mutation for saving a book to a user's list of saved books
// This mutation takes a BookInput object as input parameter
// It returns updated user information with the newly saved book
export const SAVE_BOOK = gql`
    mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                description
                authors
                image
                link
            }
        }
    }
`;

// Define a GraphQL mutation for deleting a book from a user's list of saved books
// This mutation takes userId and bookId as input parameters
// It returns updated user information after deleting the specified book
export const DELETE_BOOK = gql`
    mutation deleteBook($userId: ID!, $bookId: String!) {
        deleteBook(userId: $userId, bookId: $bookId) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                description
                authors
                image
                link
            }
        }
    }
`;
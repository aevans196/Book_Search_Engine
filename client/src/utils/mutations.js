import { gql } from '@apollo/client';

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
            email
        }
    }
}`

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            email
        }
    }
}`

export const REMOVE_BOOK = gql`
mutation removeBook($userId: ID!, $bookId: String!) {
    removeBook(userId: $userId, bookId: $bookId) {
        savedBooks {
            bookId
            authors
            description
            image
            title
            link
        }
    }
}`

export const SAVE_BOOK = gql`
mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
        savedBooks {
            bookId
            authors
            description
            image
            title
            link
        }
    }
}`
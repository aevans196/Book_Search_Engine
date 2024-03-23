const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String 
        link: String
    }

    input BookInput {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String 
        link: String
    }


    type Auth {
        token: ID!
        user: User!
    }

    type Query {
        me(userId: ID!): User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(userId: ID!, bookId: String! ): User
    }
`;

module.exports = typeDefs;
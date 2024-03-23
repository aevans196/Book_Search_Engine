const { User } = require('../models'); // Importing the User model for database operations
const { signToken, AuthenticationError } = require('../utils/auth'); // Importing signToken function and AuthenticationError object from authentication utilities

const resolvers = {

    Query: {
        me: async (parent, { userId }, context) => { // Resolver function to retrieve the logged-in user
            // Find the user in the database based on user ID
            return User.findOne({ _id: userId });
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => { // Resolver function to add a new user
            // Create a new user in the database
            const user = await User.create({ username, email, password });
            // Sign a token for the newly created user
            const token = signToken(user);
            // Return the token and user data
            return { token, user };
        },

        login: async (parent, { email, password }) => { // Resolver function to handle user login
            // Find the user in the database based on email
            const user = await User.findOne({ email });

            // If user doesn't exist, throw authentication error
            if(!user) {
                throw AuthenticationError;
            }

            // Check if the provided password is correct
            const correctPassword = await user.isCorrectPassword(password);

            // If password is incorrect, throw authentication error
            if (!correctPassword) {
                throw AuthenticationError;
            }

            // Sign a token for the authenticated user
            const token = signToken(user);
            // Return the token and user data
            return { token, user };
        },

        saveBook: async (parent, {input}, context) => { // Resolver function to save a book to user's savedBooks
            // Check if the user has a valid JWT token by checking the context
            if (context.user) {
                // Find the user in the database and push the new book to savedBooks array
                return User.findOneAndUpdate(
                  { _id: context.user._id },
                  {
                    $push: { savedBooks: input },
                  },
                  {
                    new: true,
                    runValidators: true,
                  }
                );
            }
            throw AuthenticationError('You need to be logged in!'); // Throw authentication error if user is not authenticated
        },

        deleteBook: async (parent, {bookId}, context) => { // Resolver function to delete a book from user's savedBooks
            // Check if the user has a valid JWT token by checking the context
            if (context.user) {
                // Find the user in the database and pull the specified book from savedBooks array
                return User.findOneAndUpdate(
                  { _id: context.user._id },
                  {
                    $pull: { 
                      savedBooks: { bookId: bookId },
                    },
                  },
                  {
                    new: true,
                  }
                );
            }
            throw AuthenticationError('You need to be logged in!'); // Throw authentication error if user is not authenticated
        }
    },

};

module.exports = resolvers; // Export the resolver object
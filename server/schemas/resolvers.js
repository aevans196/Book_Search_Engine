const { signToken, AuthenticationError } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async (parent, {userId}, context) => {
            return User.findOne({_id: userId});
        }
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});
            if(!user) {
                throw AuthenticationError;
            }
            const pass = await user.isCorrectPassword(password);
            if(!pass) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return {token, user};
        },
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (parent, {input}, context) => {
            if(context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    {
                        _id: context.user._id,
                    },
                    {
                        $push: {
                            savedBooks: input,
                        },
                    },
                    {new: true, runValidators: true}
                )
                return updateUser;
            }
            throw AuthenticationError;
        },
        removeBook: async (parent, {userId, bookId}, context) => {
            if(context.user) {
                return await User.findByIdAndUpdate(
                    {
                        _id: context.user._id,
                    },
                    {
                        $pull: {
                            savedBooks: {
                                bookId: bookId,
                            },
                        },
                    },
                    {new: true},
                );
            }
        }
    }
};

module.exports = resolvers;
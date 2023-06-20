const mongoose = require('mongoose');

const Auth = mongoose.model('Auth', {
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        confirmPassword: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
        },
        role: {
            type: String,
            required: true
        },
        user_type: {
            type: String,
            required: true
        },
        is_verified: {
            type: Number,
            required: true
        },
});

module.exports = Auth;
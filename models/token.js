const mongoose = require('mongoose');

const Token = mongoose.model('Token', {
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expired: {
        type: Number,
        required: true
    }
});

module.exports = Token;

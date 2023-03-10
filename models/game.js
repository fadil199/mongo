const mongoose = require('mongoose');

const Game = mongoose.model('Game', {
        user_id: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        nama_game: {
            type: String,
            required: true
        },
        nilai: {
            type: Number,
            required: true
        }
});

module.exports = Game;
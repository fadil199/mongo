const mongoose = require('mongoose');

const Profile = mongoose.model('Profile', {
        user_id: {
            type: String
        },
        fullName: {
            type: String
        },
        gender: {
            type: String
        },
        country: {
            type: String
        },
        province: {
            type: String
        },
        city: {
            type: String
        },
        address: {
            type: String
        },
        phone: {
            type: String
        },
});

module.exports = Profile;
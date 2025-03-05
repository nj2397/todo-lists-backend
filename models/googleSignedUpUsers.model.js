const mongoose = require('mongoose');

const googleOAuthSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },

    email: {
        type: mongoose.SchemaTypes.String,
        required: true
    }, 

    verified: {
        type: mongoose.SchemaTypes.Boolean,
        required: true
    }
})

const googleOAuthUsers = mongoose.model("googleOAuthUsers", googleOAuthSchema, collection="google_oauth_users")

module.exports = googleOAuthUsers;
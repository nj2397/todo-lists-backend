const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    username: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
})

const usersLists = mongoose.model("usersLists", usersSchema, collection = "users_lists")

module.exports = usersLists;
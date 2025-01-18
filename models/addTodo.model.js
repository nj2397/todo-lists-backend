const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    title: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    date: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    time: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
})


const todoLists = mongoose.model("todoLists", todoSchema, "todo_lists");

module.exports = todoLists;
require('dotenv').process;
const express = require('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');
const todo = require("./routes/addTodo.routes")
require('dotenv').config();

const app = express();

// const url = 'mongodb://127.0.0.1:27017';

// const client = new MongoClient(url)

// async function main() {
//     try {

//         await client.connect();

//         console.log('Connected to Mongo successfully')

//         client.db('todos')

//         app.use(express.json())
        
//         app.use("/todo", todo)

//         app.listen(8082, () => console.log("Server listening to PORT", 8082))

//     } catch (err) {
//         console.error('Connection failed', err);
//     }
// }

// main().catch(console.error);



// mongoose.connect('mongodb://127.0.0.1:27017/todos')
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to DB todos"))
    .catch((error) => console.log("Failed to connect to DB", error)) 


app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600
}))

app.use("/todo", todo);



app.listen(8082, () => {
    console.log("Server listening at PORT", process.env.PORT);
})


const { validate } = require("../models/addTodo.model");
const {
    loginAuth,
    signupAuth,
    addATodo,
    listAllTodos,
    checkUser,
    update,
    updateATodo,
    searchTodos
} = require("../service/addATodo.service");
const { validateToken } = require("../utils/resp.utils");




const login = async (req, res) => {
    try {
        const response = await loginAuth(req.body)
        console.log('response --> ', response)
        if (response === "No User"){
            return res.status(200).json({
                "status": 200,
                "message": "User Not Found"
            });
        }

        if (response === "Password didn't match") {
            return res.status(200).json({
                "status": 200,
                "message": "Incorrect Password"
            })
        }
        if (response) {
            return res.status(200).json({
                "status": 200,
                "message": response
            });
        } 
    } catch (err) {
        res.status(500).json({ 
            "status": 500,
            "message": err.message
         })
    }
}


const signup = async (req, res) => {
    try {

        const user = await checkUser(req.body);
        if (user) {
            return res.status(409).json({
                "status": 409,
                "message": "User already exists"
            })
        }


        const response = await signupAuth(req.body);

        if (response) {
            res.status(200).json({
                "status": 200,
                "message": "Signup Successful"
            })
        } else {
            res.status(400).json({
                "status": 400,
                "message": "Signup Failed"
            })
        }
    } catch (err) {
        res.status(500).json({ 
            "status": 500,
            "message": err.message 
        })
    }
}

const listTodos = async (req, res) => {
    try {
        const validToken = validateToken(req.headers.authorization);

        console.log('validToken --->', validToken)

        if (validToken?.status === 401) {
            return res.status(401).json({
                "status": 401,
                "message": "Invalid Token"
            })
        }

        const response = await listAllTodos(req.query);

        if (response) {
            return res.status(200).json({
                "status": 200,
                "message": response
            })
        }
    } catch (err) {
        return res.status(500).json({
            "status": err,
            "message": err.message
        })
    }
}

const addTodo = async (req, res) => {
   try {

        const validToken = validateToken(req.headers.authorization);

        if (validToken?.status === 401) {
            return res.status(401).json({
                "status": 401,
                "message": "Invalid Token"
            })
        }

        const response = await addATodo(req.body);
        if (response) {
            return res.status(200).json({
                "status": 201,
                "message": "Todo added successfully"
            })
        } else {
            return res.status(400).json({
                "status": 400,
                "message": "Todo already exists"
            })
        }
        
   } catch (err) {
        return res.status(500).json({ 
            "status": err,
            "message": err.message 
        })
   }
}

const updateTodo = async (req, res) => {
    try {
        const validToken = validateToken(req.headers.authorization);

        if (validToken?.status === 401) {
            return res.status(401).json({
                "status": 401,
                "message": "Invalid Token"
            })
        }

        const response = await updateATodo(req.body);

        if (response) {
            return res.status(200).json({
                "status": 200,
                "message": response
            })
        } 
    } catch (err) {
        return res.status(500).json({
            "status": 500,
            "message": err.message
        })
    }
}


const searchTodo = async (req, res) => {
    try {
        const validToken = validateToken(req.headers.authorization);

        if (validToken?.status === 401) {
            return res.status(401).json({
                "status": 401,
                "message": "Invalid Token"
            })
        }

        const response = await searchTodos(req.body);

        if (response) {
            return res.status(200).json({
                "status": 200,
                "message": response
            })
        }

    } catch (err) {
        return res.status(200).json({
            "status": 500,
            "message": err.message
        })
    }
}


module.exports = {
    login,
    signup,
    listTodos,
    addTodo,
    updateTodo,
    searchTodo
}
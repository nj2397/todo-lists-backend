require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const { validate } = require("../models/addTodo.model");
const {
    googleOAuthLogin,
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
const { default: axios } = require('axios');


const googleLogin = async (req, res) => {
    try {
        // console.log('request received --> ', process.env.CLIENT_ID, process.env.CLIENT_SECRET)
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'postmessage'
        )

        const { tokens } = await oAuth2Client.getToken(req.body.code);
        // console.log('googleAPItokens --> ', tokens)

        if (tokens) {
            const { access_token, id_token } = tokens;

            const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            // console.log('profileResponse --> ', profileResponse)
            let userSave = await googleOAuthLogin(profileResponse.data)
            console.log('userSave --> ', userSave)

            if (userSave)
                return res.status(200).json({
                    status: 200,
                    message: 'User has been saved',
                    data: {
                        userID: userSave._doc.userID,
                        token: userSave.token
                    }
            })

            return res.status(422).json({
                status: 422,
                message: 'Failed to save the user data'
            })
        } else
            return res.status(500).json({
                status: 500,
                message: "Failed to fetch ID"
            })

    } catch (error){
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

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

        console.log('req.body --> ', req.body)

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
    googleLogin,
    login,
    signup,
    listTodos,
    addTodo,
    updateTodo,
    searchTodo
}
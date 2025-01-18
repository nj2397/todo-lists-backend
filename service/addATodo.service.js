const bcrypt = require('bcrypt')
const todoLists = require("../models/addTodo.model");
const usersLists = require("../models/users.model");
const { 
    generateRandomNumber,
    tokenSignup,
} = require("../utils/resp.utils");


const loginAuth = async(body) => {
    try {
        const {
            username,
            password
        } = body

        
        const result = await usersLists.findOne({
            username
        })

        if (result) {
            const verifyHashedPassword = await bcrypt.compare(password, result.password);

            console.log('verifyHashedPassword ---> ', verifyHashedPassword)
        
            if (verifyHashedPassword) { 
                const payload = {
                    username,
                    password
                }
                const token = tokenSignup( payload )
                console.log('token -->', token)

                return { ...result.toObject(), token}
            } else {
                return "Password didn't match"
            }
        } else {
            return "No User"
        }

        
    } catch (err) {
        return err
    }
}


const checkUser = async (body) => {
    const {
        username
    } = body;

    const response = await usersLists.findOne({ username });

    if (response) return response;
    else return null;
}


const encryptPassword = async (password) => {
    return await bcrypt.hash(password, 3)
        .then(hash => {
            return hash
        })
        .catch(err => { return null })
}


const signupAuth = async(body) => {

    const {
        username,
        password
    } = body;

    const userID = generateRandomNumber();

    const hashedPassword = await encryptPassword(password);    

    if (hashedPassword) {

        console.log('hashedPassword -->', hashedPassword)

        const response = await new usersLists({
            userID,
            username,
            password: hashedPassword
        }).save({ validateSaveBeforeTrue: true })
    
    
        if (response) {
            return response
        } else {
            return null;
        }
    }
} 

const listAllTodos = async (query) => {     

    const userID = parseInt(query.id);

    const response = await todoLists.find({ userID });

    if (response) {
        const sortedResponse = response.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            if (a.time < b.time) return -1;  
            if (a.time > b.time) return 1;
            return 0;              
        })

        return sortedResponse;
    } else return null;
}


const addATodo = async (body) => {

    const response = await todoLists.findOne({
        userID: body.id,
        title: body.title
    })


    if (response ) {
        return null;
    }
    
    const result = await new todoLists({
        userID: body.id,
        title: body.title,
        date: body.date,
        time: body.time
    }).save({
        validateSaveBeforeTrue: true
    })

    return result;
}

const updateATodo = async (body) => {

    const result = await todoLists.findOneAndUpdate(
        {
            userID: parseInt(body.id),
            title: body.initialTitle,
        },
        {
            $set: {
                title: body.title,
                date: body.date,
                time: body.time
            }
        },
        {
            new: true
        }
    )

    if (result) {
        console.log(result)
        return result;
    }
    else return null;  

}


const searchTodos = async (body) => {
    const result = await todoLists.find({
        $and: [
            { userID: body.id },
            { title: {
                $regex: body.title,
                $options: 'i'
            }}
        ]
    }) 

    if (result) 
        return result;  
    else return null;
}


module.exports = {
    loginAuth,
    checkUser,
    signupAuth,
    listAllTodos,
    addATodo,
    updateATodo,
    searchTodos
}
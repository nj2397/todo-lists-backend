const bcrypt = require('bcrypt')
const todoLists = require("../models/addTodo.model");
const usersLists = require("../models/users.model");
const googleOAuthUsers = require("../models/googleSignedUpUsers.model")
const { 
    generateRandomNumber,
    tokenSignup,
} = require("../utils/resp.utils");


class TodoService {
    googleOAuthLogin = async (body) => {
        try {
            const {
                name,
                email,
                verified_email
            } = body
    
            const googleOAuthExistingUser = await googleOAuthUsers.findOne({ email })
    
            if (googleOAuthExistingUser) {
                const token = tokenSignup({ email, name })
                console.log('googleOAuthExistingUser -->', googleOAuthExistingUser)
                return {...googleOAuthExistingUser, token};
            }
    
            const userID = generateRandomNumber();
    
            const googleOAuthResponse = await new googleOAuthUsers({
                userID,
                name,
                email,
                verified: verified_email
            }).save({ validateSaveBeforeTrue: true })
    
            console.log('googleOAuthResponse -->', googleOAuthResponse)
    
            if (googleOAuthResponse) {
                const token = tokenSignup({ email, name })
                // console.log('token -->', token)
                // googleOAuthResponse.token = token
                // console.log('googleOAuthResponse -->', googleOAuthResponse)
                return {...googleOAuthResponse, token};
            }
    
        } catch (err) {
            return err;
        }
    }

    loginAuth = async(body) => {
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

    checkUser = async (body) => {
        const {
            username
        } = body;
    
        const response = await usersLists.findOne({ username });
    
        if (response) return response;
        else return null;
    }

    encryptPassword = async (password) => {
        return await bcrypt.hash(password, 3)
            .then(hash => {
                return hash
            })
            .catch(err => { return null })
    }

    signupAuth = async(body) => {

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

    listAllTodos = async (query) => {     

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

    addATodo = async (body) => {

        const response = await todoLists.findOne({
            userID: body.id,
            title: body.title
        })
    
    
        if (response ) {
            return null;
        }
        
        const result = await new todoLists({
            userID: body.id,
            title: body.title.trim(),
            date: body.date,
            time: body.time
        }).save({
            validateSaveBeforeTrue: true
        })
    
        return result;
    }

    deleteATodo = async (body) => {
        const response = await todoLists.deleteOne({
            userID: body.id,
            title: body.title
        })
    
        if (response) {
            return response;
        }
    
        return null;
    }

    updateATodo = async (body) => {

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

    searchTodos = async (body) => {

        console.log('body --> ', body)
        const pipeline = [
            { $match: { userID: body.id } },
            { 
              $facet: {
                results: [
                  { $match: { title: { $regex: body.title, $options: 'i' } } }, 
                  { $sort: { date: 1, time: 1 } },
                  { $skip: 0 }
                ],
                totalCount: [{ $count: "count" }]
              }
            }
          ];
          
          const aggregationResult = await todoLists.aggregate(pipeline);      
          const result = aggregationResult[0].results;
          const count = aggregationResult[0].totalCount[0] ? aggregationResult[0].totalCount[0].count : 0;
    
          console.log('result, count ', result, count)
          
          return { result, count };
    }
}

module.exports = TodoService;
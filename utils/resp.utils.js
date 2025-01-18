const jwt = require('jsonwebtoken');



const generateRandomNumber = () => {
    const randomNumber = Math.floor( Math.random() * (200 - 100) + 100 );
    return randomNumber;
}

const tokenSignup = (payload) => {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '1h',
        algorithm: 'HS256'
    })

    return token;
}

const validateToken = (token) => {

    const result = jwt.verify( token, process.env.SECRET_KEY, ( err, decoded ) => {
        if (err) 
            return {
                status: 401,
                message: 'Invalid Token'
            }
        return decoded;
    })

    return result;
}

module.exports = {
    generateRandomNumber,
    tokenSignup,
    validateToken
}
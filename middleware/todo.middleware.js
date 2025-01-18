const validateBody = (validationBody) => (req, res, next) => {
    const { error } = validationBody.validate(req.body);

    if (error) {
        res.status(422).json({
            "status": 422,
            "message": error.message
        })
    } else {
        next();
    }
}

module.exports = {
    validateBody
}
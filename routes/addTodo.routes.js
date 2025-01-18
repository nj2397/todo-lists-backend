const router = require('express').Router();

const {
    loginValidation,
    signupValidation
} = require("../validations/todo.validator.js")

const { validateBody } = require ("../middleware/todo.middleware.js")

const {
    login,
    signup,
    addTodo,
    listTodos,
    updateTodo,
    searchTodo
} = require("../controller/addTodo.controller")


router.post("/login", validateBody(loginValidation), login)
router.post("/signup", validateBody(signupValidation), signup)
router.get("/getTodos", listTodos)
router.post("/addTodo", addTodo)
router.patch("/updateTodo", updateTodo)
router.post("/search", searchTodo)

module.exports = router;
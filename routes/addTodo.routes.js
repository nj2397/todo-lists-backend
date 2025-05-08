const router = require('express').Router();

const {
    loginValidation,
    signupValidation
} = require("../validations/todo.validator.js")

const { validateBody } = require ("../middleware/todo.middleware.js")
const TodoController = require("../controller/addTodo.controller.js")

const todoController = new TodoController()

router.post("/google-login", todoController.googleLogin)
router.post("/login", validateBody(loginValidation), todoController.login)
router.post("/signup", validateBody(signupValidation), todoController.signup)
router.get("/getTodos", todoController.listTodos)
router.post("/addTodo", todoController.addTodo)
router.patch("/updateTodo", todoController.updateTodo)
router.post("/search", todoController.searchTodo)
router.post('/deleteTodo', todoController.deleteTodo);

module.exports = router;
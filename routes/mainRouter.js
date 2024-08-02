express = require("express")
mainRouter = express.Router()
const mainController = require("../controllers/mainController")

mainRouter.use(express.static('../public'))

mainRouter.get("/", mainController.getHomepage)

mainRouter.get("/sign-up", mainController.getSignUpForm)

mainRouter.get("/login", mainController.getLoginForm)

mainRouter.post("/sign-up", mainController.signUp)

mainRouter.post("/login", mainController.login)


mainRouter.get("/log-out", mainController.logOut)
module.exports = mainRouter
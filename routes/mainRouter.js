express = require("express")
mainRouter = express.Router()
const mainController = require("../controllers/mainController")

mainRouter.use(express.static('../public'))

mainRouter.get("/", mainController.getHomepage)

mainRouter.get("/sign-up", mainController.getSignUpForm)

mainRouter.get("/login", mainController.getLoginForm)

mainRouter.post("/sign-up", mainController.signUp)

mainRouter.post("/login", mainController.login)

mainRouter.get("/new-post", mainController.getPostForm)

mainRouter.post("/new-post", mainController.createPost)

mainRouter.get("/log-out", mainController.logOut)

mainRouter.get("/dashboard/delete/:postID", mainController.deletePost)

mainRouter.get("/dashboard", mainController.getDashboard)

mainRouter.get("/posts", mainController.getAllPosts)

module.exports = mainRouter
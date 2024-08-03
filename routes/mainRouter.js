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

mainRouter.post("/dashboard/deleteUserTag", mainController.removeUserTag)

mainRouter.post("/dashboard/changeUserTags", mainController.changeUserTags)

mainRouter.get("/dashboard/delete/:postID", mainController.deletePost)

mainRouter.get("/dashboard", mainController.getDashboard)

mainRouter.get("/posts/complete/:postID", mainController.completePost)

mainRouter.get("/posts/accept/:postID", mainController.acceptPost)

mainRouter.get("/posts", mainController.getAllPosts)

mainRouter.get("/recommended", mainController.getRecommendedTask)



module.exports = mainRouter
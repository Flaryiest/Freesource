express = require("express")
mainRouter = express.Router()
const mainController = require("../controllers/mainController")

mainRouter.use(express.static('../public'))

mainRouter.get("/", mainController.getHomepage)

module.exports = mainRouter
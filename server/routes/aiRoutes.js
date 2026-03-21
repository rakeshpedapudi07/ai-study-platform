const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const aiController = require("../controllers/aiController")

router.post("/chat",auth,aiController.chat)

module.exports = router
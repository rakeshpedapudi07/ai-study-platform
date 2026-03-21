const express = require("express")
const router = express.Router()

const notesController = require("../controllers/notesController")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")

// Upload PDF
router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  notesController.uploadAndSummarize
)

// Get user notes
router.get(
  "/",
  authMiddleware,
  notesController.getNotes
)

// Ask question from notes
router.post(
  "/ask",
  authMiddleware,
  notesController.askNoteQuestion
)

// Generate flashcards
router.post(
  "/flashcards",
  authMiddleware,
  notesController.generateFlashcards
)

// Generate quiz
router.post(
  "/quiz",
  authMiddleware,
  notesController.generateQuiz
)

module.exports = router
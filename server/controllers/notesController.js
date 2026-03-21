const pdfParse = require("pdf-parse")
const Groq = require("groq-sdk")
const prisma = require("../prisma/prismaClient")

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

/* ================================
   Upload PDF + AI Summary
================================ */

exports.uploadAndSummarize = async (req, res) => {
  try {

    console.log("UserID:", req.userId)

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" })
    }

    const pdfData = await pdfParse(req.file.buffer)

    const text = pdfData.text.substring(0, 4000)

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an AI tutor explaining study notes simply."
        },
        {
          role: "user",
          content: `Explain these notes in simple terms:\n${text}`
        }
      ]
    })

    const summary = completion.choices[0].message.content

    const note = await prisma.note.create({
      data: {
        userId: req.userId,
        filename: req.file.originalname,
        content: text,
        summary: summary
      }
    })

    res.json({
      message: "Note uploaded successfully",
      note
    })

  } catch (err) {
    console.error("Upload Error:", err)
    res.status(500).json({ error: err.message })
  }
}


/* ================================
   Ask Question From Notes
================================ */

exports.askNoteQuestion = async (req, res) => {
  try {

    const { noteId, question } = req.body

    if (!noteId || !question) {
      return res.status(400).json({ error: "noteId and question are required" })
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return res.status(404).json({ error: "Note not found" })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful tutor answering questions from study notes."
        },
        {
          role: "user",
          content: `Here are the study notes:\n${note.content}\n\nQuestion: ${question}`
        }
      ]
    })

    const answer = completion.choices[0].message.content

    res.json({ answer })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}


/* ================================
   Get User Notes
================================ */

exports.getNotes = async (req, res) => {
  try {

    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" }
    })

    res.json(notes)

  } catch (err) {
    console.error("Get Notes Error:", err)
    res.status(500).json({ error: err.message })
  }
}


/* ================================
   Generate Quiz
================================ */

exports.generateQuiz = async (req, res) => {
  try {

    const { noteId } = req.body

    const note = await prisma.note.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return res.status(404).json({ error: "Note not found" })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Generate 5 multiple choice questions from the notes."
        },
        {
          role: "user",
          content: `Create quiz from:\n${note.content}`
        }
      ]
    })

    res.json({
      quiz: completion.choices[0].message.content
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}


/* ================================
   Generate Flashcards
================================ */

exports.generateFlashcards = async (req, res) => {
  try {

    const { noteId } = req.body

    const note = await prisma.note.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return res.status(404).json({ error: "Note not found" })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Create 5 flashcards from the notes."
        },
        {
          role: "user",
          content: `Generate flashcards from this text:\n${note.content}`
        }
      ]
    })

    res.json({
      flashcards: completion.choices[0].message.content
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
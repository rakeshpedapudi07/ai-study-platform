const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")   // ADD THIS
const aiRoutes = require("./routes/aiRoutes")
const notesRoutes = require("./routes/notesRoutes")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)   // ADD THIS
app.use("/api/ai", aiRoutes)
app.use("/api/notes",notesRoutes)
app.get("/", (req, res) => {
  res.send("AI Study Platform API Running 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
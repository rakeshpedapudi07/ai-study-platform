const prisma = require("../prisma/prismaClient")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed
      }
    })

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
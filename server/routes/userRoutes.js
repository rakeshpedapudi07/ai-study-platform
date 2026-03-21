const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const prisma = require("../prisma/prismaClient")

router.get("/profile", auth, async (req,res)=>{

 const user = await prisma.user.findUnique({
  where:{
   id:req.user.id
  },
  select:{
   id:true,
   name:true,
   email:true
  }
 })

 res.json(user)

})

module.exports = router
const Groq = require("groq-sdk")

const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
})

exports.chat = async (req,res)=>{

 const {message} = req.body

 try{

 const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
   { role: "system", content: "You are a helpful AI tutor for students." },
   { role: "user", content: message }
  ]
 })

 res.json({
  reply: completion.choices[0].message.content
 })

 }catch(err){
  res.status(500).json({error:err.message})
 }

}
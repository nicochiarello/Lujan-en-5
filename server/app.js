const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const postRoute = require('./routes/Posts')
const cors = require('cors')

dotenv.config()
app.use(express.json({ limit: '200mb' }))

app.use(cors())



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log('Db connected'))
.catch((err) => console.log(err))











app.use('/api/posts', postRoute);

app.use("/", (req,res)=>{
    res.json({'db':'running'})
})

const PORT = process.env.PORT || 8080


app.listen(PORT, ()=>{
    console.log(`server is running at port ${PORT}`);
})
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/memberRoutes.js'
import libraryRouter from './routes/libraryRoutes.js'
import queryRouter from './routes/queryRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())

app.use('/user',userRouter)
app.use("/lib",libraryRouter)
app.use('/query',queryRouter)
app.get('/',(req,res)=>{
    res.send('server running sucessfully !!!');
})

app.listen(process.env.PORT,()=>{
    console.log(`server running properly in port ${process.env.PORT}`)
})
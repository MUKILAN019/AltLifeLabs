import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/memberRoutes.js'
import libraryRouter from './routes/libraryRoutes.js'
import queryRouter from './routes/queryRoutes.js'
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())
const __dirname = path.resolve();
app.use('/user',userRouter)
app.use("/lib",libraryRouter)
app.use('/query',queryRouter)

// app.get('/',(req,res)=>{
//     res.send('server running sucessfully !!!');
// })


app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
})


app.listen(process.env.PORT,()=>{
    console.log(`server running properly in port ${process.env.PORT}`)
})
const express=require('express');
const cors=require('cors');
const app=express();
const con=require('./database')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//startind the server

app.listen(4000,()=>{
    console.log("Server is working well")
})
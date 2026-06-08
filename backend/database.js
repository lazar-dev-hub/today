const mysql=require('mysql2');
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'pms'
});

con.connect((err)=>{
    if(err){
        return console.log("Error connecting to db pms",err)
    }
    return console.log("Database connected!")
})
module.exports=con
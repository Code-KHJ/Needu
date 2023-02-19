const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mysql = require("mysql");
const connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'rla0407!',
    database: 'recruit-sw'
    
})
connection.connect(function(err) {
   if(err) throw err;
   console.log('mysql Connected') 
});


app.get("/", (req,res) => {res.send("안녕")});

app.post("/signup",(req, res) => {
    //회원가입 시 필요한 정보를 클라이언트에서 가져와서 데이터베이스에 넣어줌
    const sqlinsert = 'INSERT INTO user SET ?';
    const user_info = {
        id : req.body.id,
        password : req.body.password,
        name : req.body.name,
        phonenumber : req.body.phonenumber,
        email : req.body.email
    }
    connection.query(sqlinsert, user_info, function(err, rows, fields){
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true     
        })
        })
    })
    
// connection.end()


app.listen(port, () => {console.log(`Server started on port ${port}`)});
const express = require("express");
const nunjucks = require("nunjucks");
const { body, validationResult } = require("express-validator");
const mysql = require("mysql");
const port = 3000;
const path = require("path");
const dbconfig = require("./config/dbconfig.json");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {auth} = require("./middleware/auth");
const indexRouter = require("./routes/index");
const {
    login,
    logout,
    signup,
} = require("./controllers/user.js");
dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:3000',
    methods : ['GET', 'POST'],
    credentials : true,
}))

app.set('view engine', 'html')
nunjucks.configure('./public', {
    autoescape : true,
    watch : true,
    express : app,
})

// Database connection pool
const pool = mysql.createPool({
    host    : dbconfig.host,
    user    : dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 100,
    debug   :false
})
// app.use(auth)
app.get("/", auth, (req, res)=>{
    const user = req.user
    res.render('main.html', {user: user})
})
// app.use("/", indexRouter)
app.get("/login", (req,res)=>{
    res.render('login.html')
})
app.post("/login", login)
app.get("/logout", logout)

app.get("/signup", (req,res)=>{
    res.sendFile(__dirname+'/public/signup.html')
})

app.post("/register", signup)

app.post("/checkId",(req, res) =>{
    const checkId = req.body.id
    let result = 1
    pool.query('SELECT id FROM user WHERE id = "' + checkId + '"', (err, row)=>{
        if(row[0] == undefined){
            res.send(JSON.stringify(result))
        } else{
            result = 2
            res.send(JSON.stringify(result))
        }
    })})

app.listen(port, () => {console.log(`Server started on port ${port}`)});
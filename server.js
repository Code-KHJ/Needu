const express = require("express");
const nunjucks = require("nunjucks");
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
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
    checkId,
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

app.post("/signup", signup)

app.post("/checkId",checkId)

app.listen(port, () => {console.log(`Server started on port ${port}`)});
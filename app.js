const express = require("express");
const nunjucks = require("nunjucks");
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const moment = require("moment");
const {auth} = require("./routes/middleware/auth");
const indexRouter = require("./routes/index");
const {logout} = require("./routes/controllers/user.js");
const {mid_search_result} = require("./routes/middleware/review");
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

app.use("/", require("./routes/index"))
app.get("/logout", auth, logout)
app.use("/signup", require("./routes/signup"));
app.use("/login", require("./routes/login"));
app.use("/review", require("./routes/review"));
app.use("/review/write", require("./routes/review_write"));

app.get("/404", auth, (req, res)=>{
    res.render('404.html', {User: req.user})
})

// app.use((err, req, res, next)=>{
//     console.log(err);
//     res.render('404.html', {})
// })
app.listen(port, () => {console.log(`Server started on port ${port}`)});
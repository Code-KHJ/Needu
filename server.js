const express = require("express");
const app = express();
const port = 3010;
const bodyParser = require("body-parser");
const { User } = require("./models/user");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://KHJ:rla0407@cluster0.gnyfswz.mongodb.net/?retryWrites=true&w=majority", {
}).then(() => console.log("MongoDB Connected..."))
  .catch(err => (console.log(err)))


app.get("/", (req,res) => {res.send("안녕")});

app.post("/signup",(req, res) => {
    //회원가입 시 필요한 정보를 클라이언트에서 가져와서 데이터베이스에 넣어줌
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {console.log(`Server started on port ${port}`)});
const express = require("express");
const app = express();
const port = 3010;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://KHJ:rla0407@cluster0.gnyfswz.mongodb.net/?retryWrites=true&w=majority", {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected..."))
  .catch(err => (console.log(err)))


app.get("/", (req,res) => {
    res.send("안녕")
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)});
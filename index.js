const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require("mongoose")
// const helmet = require('helmet');

const {home} = require('./routes/home');
const admin = require('./routes/admin');
const student = require('./routes/student');

const error = require('./routes/error');

const port = process.env.PORT || 3000;


mongoose.connect("mongodb://localhost/college")
.then(()=>{
    console.log("connected to mongodb");
})
.catch((err=>{
    console.log(`Error: ${err}`);
}))




app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(helmet());


app.set("view engine", "ejs");


app.use("/", home);
app.use("/student", student);
app.use("/admin", admin);
app.use("/error", error)



app.listen(port, ()=>{
    console.log(`Your app running on port: ${port}`);
});
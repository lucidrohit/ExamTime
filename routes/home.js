const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const { materialSchema } = require("../models/material");


const College = mongoose.model("nitsri", new mongoose.Schema({
    year: Number,
    branch: String,
    semester: [materialSchema]
}))

router.get("/", (req,res)=>{
    res.render("index")
})


exports.home = router;
exports.College = College

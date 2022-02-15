const express = require('express');
const router = express.Router();
const { materialSchema } = require("../models/material");
const Joi = require('joi');
const {validateStudent} = require("../models/session")

const currentYear = new Date().getFullYear();

const College = mongoose.model("nitsri", new mongoose.Schema({
    year: Number,
    branch: String,
    semester: [materialSchema]
}))


router.post("/", (req, res) => {
    let studentEnroll = req.body.studentEnroll;

    let studentInfo = {
        year: Number(studentEnroll.slice(0,4)),
        branch: studentEnroll.slice(4,8),
        yearNo: currentYear-Number(studentEnroll.slice(0,4)),
        level:"student"
    }

    const message = validateStudent(studentInfo);
    const status = 400;
    (message==1)?res.render("session", studentInfo):res.render("error", {message, status});
    
});





module.exports = router;



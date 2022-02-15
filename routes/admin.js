const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {validateStudent} = require("../models/session")

const currentYear = new Date().getFullYear();



router.post("/", (req, res) => {
    let studentEnroll = req.body.studentEnroll;
    const password = req.body.password;

    let studentInfo = {
        year: Number(studentEnroll.slice(0,4)),
        branch: studentEnroll.slice(4,8),
        yearNo: currentYear-Number(studentEnroll.slice(0,4)),
        level:"admin"
    }

    let message = validateStudent(studentInfo);
    const status = 400;
    (message==1)?console.log(""):res.render("error", {message, status});
    
    message = "Invalid Password.";
    (password=="admin123")?res.render("session", studentInfo):res.render("error", {message, status});
    
});





module.exports = router;



const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const Joi = require('joi');
const {validateStudent} = require("../models/session")
const {validateCourse} = require("../models/validation");
const currentYear = new Date().getFullYear();

const {College} = require("./home")


router.post("/", (req, res) => {
    let studentEnroll = req.body.studentEnroll;
    const material = "syllabus";
    let studentInfo = {
        year: Number(studentEnroll.slice(0,4)),
        branch: studentEnroll.slice(4,8),
        yearNo: currentYear-Number(studentEnroll.slice(0,4)),
        level:"student",
        material:material
    }

    const message = validateStudent(studentInfo);
    const status = 400;
    (message==1)?res.render("session", studentInfo):res.render("error", {message, status});
    
});

router.get("/:year/:branch/:sem/:material", async (req, res) => {
    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    let material = req.params.material;
    let mName = material

   
    let course = {year:year, branch:branch, sem:sem,material:(material)?material:"syllabus"};
    const {error} = validateCourse(course);
    const status = 400;

    const message = "Something wrong happened";

    if(error) return res.render("error", {status, message})

    course = await College.findOne({ branch: branch, year: year });
    
    material = course.semester[sem][material]
    let studentInfo = {
        year: year,
        branch: branch,
        level:"student",
        material:material,
        sem:sem,
        mName:mName
    }

    res.render("materialStudent", studentInfo);
})



module.exports = router;



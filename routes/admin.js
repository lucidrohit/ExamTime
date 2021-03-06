const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const {validateCourse} = require("../models/validation");
const {validateBody} = require("../models/validation");
const {validateStudent} = require("../models/session")
const Joi = require('joi');


const currentYear = new Date().getFullYear();


const {College} = require("./home");


router.post("/", (req, res) => {
    let studentEnroll = req.body.studentEnroll;
    const password = req.body.password;
    const material = "syllabus"
    let studentInfo = {
        year: Number(studentEnroll.slice(0,4)),
        branch: studentEnroll.slice(4,8),
        yearNo: currentYear-Number(studentEnroll.slice(0,4)),
        level:"admin",
        material:material
    }

    let message = validateStudent(studentInfo);
    const status = 400;
    (message==1)?console.log(""):res.render("error", {message, status});
    
    message = "Invalid Password.";
    (password=="admin123")?res.render("session", studentInfo):res.render("error", {message, status});
    
});

router.get("/delete/:year/:branch/:sem/:material/:subject", async (req, res) => {
    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;
    const subject = req.params.subject;
    const index = Number(req.query.index);

    let course = {year:year, branch:branch, sem:sem,material:material};
    
    const {error} = validateCourse(course);
    const status = 400;
    const message = "Something went wrong.";
    if(error) return res.render("error", {status, message})
    
    course = await College.findOne({ branch: branch, year: year })

    await course.semester[sem][material].splice(index,1);

    await course.save();

    res.redirect(`/admin/${year}/${branch}/${sem}/${material}`);
});



router.get("/:year/:branch/:sem/:material", async (req, res) => {
    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;

    let course = {year:year, branch:branch, sem:sem,material:(material)?material:"syllabus"};

    const {error} = validateCourse(course);
    const status = 400;
    const message = "Something went wrong.";
    if(error) return res.render("error", {status, message})

    course = await College.findOne({ branch: branch, year: year });
    
    let studentInfo = {
        year: year,
        branch: branch,
        level:"admin",
        sem:sem,
        material:material,
        course :course.semester[sem][material]
    }
    
    res.render("materialAdmin", studentInfo);
})


router.post("/:year/:branch/:sem/:material", async (req, res) => {
    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;

    let course = {year:year, branch:branch, sem:sem,material:material};
    
    const {error} = validateCourse(course);
    const status = 400;
    let message = "Something went Wrong";
    if(error) return res.render("error", {status, message})

        
    let validbody = validateBody(req.body)
    message = validbody
    if(message.error) return res.render("error", {status, message});
    
    course = await College.findOne({ branch: branch, year: year })
    
    course.semester[sem][material].push(req.body);
    await course.save();

    res.redirect(`/admin/${year}/${branch}/${sem}/${material}`);
})

router.put("/:year/:branch/:sem/:material/:subject", async (req, res) => {

    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;
    const subject = req.params.subject;

    let course = {year:year, branch:branch, sem:sem,material:material};
    
    const {error} = validateCourse(course);
    let status = 400;
    let message = error.message;
    if(error) return res.render("error", {status, message})


    let validbody = validateBody(req.body)
    message = validbody.error;
    if(message) return res.render("error", {status, message});
    
    course = await College.findOne({ branch: branch, year: year })

    let found = course.semester[sem][material];
    let foundIndex = -1;

    for (let i=0; i<found.length; i++){

        if(found[i]["subjectName"].trim()===subject){
            foundIndex = i;
        }
    }
    message = `Not founded ${foundIndex}`
    if(foundIndex ===-1) {return res.render("error", message)}

    course.semester[sem][material][foundIndex]["subjectName"] = req.body.subjectName;
    course.semester[sem][material][foundIndex]["subjectLink"] = (!req.body.subjectLink)?course.semester[sem][material][foundIndex]["subjectLink"]:req.body.subjectLink;

    await course.save();
    res.render("materialAdmin",course.semester[sem][material])
})





module.exports = router;



const express = require('express');
const router = express.Router();
const { materialSchema } = require("../models/material");
const {validateCourse} = require("../models/validation");
const {validateBody} = require("../models/validation");

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



router.get("/:year/:branch/:sem/:material", async (req, res) => {
    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;

    let course = {year:year, branch:branch, sem:sem,material:material};

    const {error} = validateCourse(course);
    if(error) return res.status(400).send(error.message)

    course = await College.findOne({ branch: branch, year: year });
    
    res.send(course.semester[sem][material]);
})


router.post("/:year/:branch/:sem/:material", async (req, res) => {

    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;

    let course = {year:year, branch:branch, sem:sem,material:material};
    
    const {error} = validateCourse(course);
    if(error) return res.status(400).send(error.message)

        
    let validbody = validateBody(req.body)
    if(validbody.error) return res.status(400).send(`${validbody.error}`);
    
    course = await College.findOne({ branch: branch, year: year })
    
    course.semester[sem][material].push(req.body);
    await course.save();
    res.send(course.semester[sem][material])
})


router.put("/:year/:branch/:sem/:material/:subject", async (req, res) => {

    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;
    const subject = req.params.subject;

    let course = {year:year, branch:branch, sem:sem,material:material};
    
    const {error} = validateCourse(course);
    if(error) return res.status(400).send(error.message)


    let validbody = validateBody(req.body)
    if(validbody.error) return res.status(400).send(`${validbody.error}`);
    
    course = await College.findOne({ branch: branch, year: year })

    let found = course.semester[sem][material];
    let foundIndex = -1;

    for (let i=0; i<found.length; i++){

        if(found[i]["subjectName"].trim()===subject){
            foundIndex = i;
        }
    }
    
    if(foundIndex ===-1) {return res.send(`Not founded ${foundIndex}`)}

    course.semester[sem][material][foundIndex]["subjectName"] = req.body.subjectName;
    course.semester[sem][material][foundIndex]["subjectLink"] = (!req.body.subjectLink)?course.semester[sem][material][foundIndex]["subjectLink"]:req.body.subjectLink;

    await course.save();
    res.send(course.semester[sem][material])
})


router.delete("/:year/:branch/:sem/:material/:subject", async (req, res) => {

    const year = Number(req.params.year);
    const branch = req.params.branch;
    const sem = Number(req.params.sem);
    const material = req.params.material;
    const subject = req.params.subject;

    let course = {year:year, branch:branch, sem:sem,material:material};
    
    const {error} = validateCourse(course);
    if(error) return res.status(400).send(error.message)
    
    course = await College.findOne({ branch: branch, year: year })

    let found = course.semester[sem][material];
    let foundIndex = -1;

    for (let i=0; i<found.length; i++){

        if(found[i]["subjectName"].trim()===subject){
            foundIndex = i;
        }
    }
    
    if(foundIndex ===-1) {return res.send(`Not founded ${foundIndex}`)}

    course.semester[sem][material].splice(foundIndex,1);

    await course.save();
    res.send(course.semester[sem][material])
})





module.exports = router;



const mongoose = require("mongoose");
const Joi = require("joi");

function validateCourse(course){
    const schema = Joi.object({
        year:Joi.number().required().min(1).max(4),
        branch:Joi.string().required().valid("bele","bcse","bite", "bmme", "bche", "bece", "bciv"),
        sem:Joi.number().required().min(0).max(3),
        material:Joi.string().required().valid("syllabus", "pattern", "pyqs", "notes", "books")
    });
    return schema.validate(course)
}



function validateBody(body){
    const schema = Joi.object({
        subjectName:Joi.string().required(),
        subjectLink:Joi.string()
    });
    return schema.validate(body)
}
exports.validateCourse = validateCourse;
exports.validateBody = validateBody;
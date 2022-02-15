const Joi = require('joi');

const currentYear = new Date().getFullYear();

const schema = Joi.object({
    year: Joi.number()
        .integer()
        .min(currentYear-4)
        .max(currentYear-1),
    branch: Joi.string()
            .min(3)
            .max(3)
            .valid(...["bele", "bmec", "bmme", "bele", "bece", "bite", "bcse", "bciv"]),
    yearNo: Joi.number(),
    level:Joi.string().max(10),
    material:Joi.string().max(20)
});


function validateStudent(studentInfo) {
    const {error} =  schema.validate(studentInfo);
    return (error)?error.message:1;
}


exports.validateStudent = validateStudent;
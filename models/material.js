const mongoose = require('mongoose');
const {subject} = require("./subject")
const materialSchema =  new mongoose.Schema({
        syllabus:[subject],
        pattern:[subject],
        pyqs:[subject],
        notes:[subject],
        books:[subject]
});

exports.materialSchema = materialSchema;
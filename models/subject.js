const mongoose = require('mongoose');


const subject =  new mongoose.Schema({
        subjectName:String,
        subjectLink:String
});

exports.subject = subject;
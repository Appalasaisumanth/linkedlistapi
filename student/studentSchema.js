const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const StudentSchema = new Schema({
    username: { type: String, required: true },
    full_name:{type: String, required: true},
    degree:{type: String, required: true},
    gender:{type: String, required: true},
    branch:{type: String, required: true},
    grade:{type: Number, required: true},
    phno:{type: String, required: true},
    college:{type: String, required: true},
    skills:[{type:String,required:true}],
    additional_skills:{type:String},
    projects:{type:String},
    profile:{type:String,required:true},
    resume:{type:String,required:true},
    abondon:{type:Boolean},


   
});

StudentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Student', StudentSchema);



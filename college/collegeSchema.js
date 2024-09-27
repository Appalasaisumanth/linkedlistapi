const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const CollegeSchema = new Schema({
    username: { type: String, required: true },
    ranking:{type: Number, required: true},
    percentage:{type: Number, required: true},
    profile:{type:String,required:true},
   
});

CollegeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('College', CollegeSchema);



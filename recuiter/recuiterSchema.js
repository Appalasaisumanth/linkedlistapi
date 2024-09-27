const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const Student=require('../student/studentSchema');
const College=require('../college/collegeSchema');


const RecuiterSchema = new Schema({
    username: { type: String, required: true },
    skills_required:[{type:String,required:true}],
    vacancy_Female:{ type: Number, required: true },
    vacancy_Male:{ type: Number, required: true },
    stipend:{ type: Number, required: true },
    Male_applied:[{type:String}],
    Female_applied:[{type:String}],
    company_applied:[{type:String}],
    Grade_cutoff_Male:{ type: Number, required: true },
    Grade_cutoff_Female:{ type: Number, required: true },
    company_rank_cutoff:{ type: Number, required: true },
    profile:{type:String,required:true}
   
});

RecuiterSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Recuiter', RecuiterSchema);



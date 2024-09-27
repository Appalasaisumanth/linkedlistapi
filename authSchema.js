const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const authSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    type:{type:String,required:true}
   
});

authSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auth', authSchema);



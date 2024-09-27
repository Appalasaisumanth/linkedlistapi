const express=require('express');
//const app=express();
const Router=express.Router();
const Student=require("./student_functions");
const fileUpload=require("../file-upload")

 Router.get('/',(req,res,next)=>{res.status(200).json({message:"hello student"})})
Router.post('/create',Student.Create);
Router.get('/:username',Student.getUser);
Router.post('/new', fileUpload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), Student.newuser);
Router.patch('/update', fileUpload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), Student.update);
Router.get("/rec/sort",Student.getsort);


module.exports = Router;
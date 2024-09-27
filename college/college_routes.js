const express=require('express');
//const app=express();
const Router=express.Router();
const college=require("./college_functions");
const fileUpload=require("../file-upload")
Router.get('/',(req,res,next)=>{res.status(200).json({message:"hello college"})});
Router.post('/create',college.Create);
Router.get('/:username',college.get_college);
Router.get('/:username/students',college.college_get_students);
Router.get('/:username/stats',college.get_stats);
Router.post('/new',fileUpload.single('profile'),college.newcollege);
Router.patch('/update',fileUpload.single('profile'),college.update);
Router.delete('/:username',college.Delete);
Router.get("/rec/sort",college.getsort);

module.exports=Router;
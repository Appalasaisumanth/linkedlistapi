const express=require('express');
//const app=express();
const Router=express.Router();
const Recuiter=require("./Recuiter_functions");
const fileUpload=require("../file-upload")

 Router.get('/',(req,res,next)=>{res.status(200).json({message:"hello recuiter"})})
Router.post('/create',Recuiter.Create);
Router.get('/:username',Recuiter.getRec);
Router.post('/new',fileUpload.single('profile'),Recuiter.newrec);
Router.patch('/update',fileUpload.single('profile'),Recuiter.update);
Router.get('/rec/student/:username',Recuiter.recstudents);
Router.get('/rec/college/:username',Recuiter.reccollege);
Router.get('/student/:username',Recuiter.students);
Router.get('/college/:username',Recuiter.colleges);
Router.get('/save/student',Recuiter.savstudent);
Router.get('/save/college',Recuiter.savcollege);
Router.get('/sort/student',Recuiter.sortstudent);

module.exports = Router;
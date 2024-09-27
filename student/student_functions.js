const mongoose=require('mongoose');
const express=require('express');
const Student=require('./studentSchema');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

function make_skills(skills)
{
    const n=Math.floor(Math.random()*6);
    const shuffledArray = skills.sort(() => Math.random() - 0.5);
    return skills.slice(0,n);

}
async function Create(req,res,next)
{
try{
    const existing=await Student.find();
    if(existing.length>0)
    {
        return res.status(200).json({message:"already-users-existing"});
    }
    else{
try{
    const profileid=uuidv4();
    const resumeid=uuidv4();
    const profileFile='./../my-app/public/uploads/images/logo.png';
    const resumeFile='./../my-app/public/uploads/pdfs/document.pdf';

    const newProfileFile=`./../my-app/public/uploads/images/${profileid}.png`;
    const newResumeFile=`./../my-app/public/uploads/pdfs/${resumeid}.pdf`;
    fs.copyFileSync(path.join(__dirname,'..',profileFile),path.join(__dirname,'..',newProfileFile));
    fs.copyFileSync(path.join(__dirname,'..',resumeFile),path.join(__dirname,'..',newResumeFile));
   
    const degree=["Bachelors","Masters","Dual_Degree","PostGraduation"];
    const gender=["male","female"];
    const Branch=["CSE","EE","ECE","MECH","CIVIL","Meta"];
    const skills=["web-dev","front-end","app-dev","ml","dsa"];
    for(var i=0;i<150;i++)
    {
    const newstudent = new Student({
        username: 'student'+String(i+1) ,  
        full_name: 'Student'+String(i+1)+"of house targareyn",
        degree: degree[(i%4)],
        gender: gender[(i%2)],
        branch: Branch[(i%6)],
        grade: 6+Math.random()*4,
        phno: '91-1234567890',
        college: 'college'+String((i%10)+1),
        skills: make_skills(skills),
        additional_skills: 'MongoDB, Express.js',
        projects: 'E-commerce web application',
        profile: profileid+'.png',  // UUID filename for profile picture
        resume: resumeid+'.pdf',
        abondon:false    // UUID filename for resume
      });

      await newstudent.save();
    }
   return res.status(201).json({ message: 'Dummy student created successfully', student: newStudent });
    
}
catch(err)
{console.log(err);
   return res.status(500).json({messaage:"internel server error"})
}}}
catch(err)
{
    console.log(err);
    return res.status(500).json({message:"internal server error"});

}
 
}
async function getUser(req,res,next)
{
  const user=req.params.username;
  try{
    const user2=await Student.findOne({username:user});
    if(user2)
    {
        res.status(200).json({message:user2});
    }
    else
    {
        res.status(400).json({message:"ur profile doesnot exist,create new one"});
    }
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({message:"internal server error"});
  }
}
async function newuser(req,res,next)
{ 
try{
  const user=await Student.findOne({username:req.body.username});
  if(user)
  {
    return res.status(409).json({message:"already user exists"});
  }else
  { req.body.skills=req.body.skills.split(",");
    const user= new Student({
      username:req.body.username,
      full_name:req.body.full_name,
      degree:req.body.degree,
      gender:req.body.gender,
      branch:req.body.branch,
      grade:req.body.grade,
      college:req.body.college,
      skills:req.body.skills,
      additional_skills:req.body.additional_skills,
      projects:req.body.projects,
      profile:req.files['profile'] ? req.files['profile'][0].filename : null ,
      resume: req.files['resume'] ? req.files['resume'][0].filename : null,
      phno:req.body.phno,
      abondon:false

    })
    try{
      await user.save();
      
      return res.status(200).json({message:"successful completion",data:user});
    }
    catch(err)
    {
      console.log(err);
      return res.status(400).json({message:"internal server error"});
    }
  }
}
catch(err)
{
  return res.status(400).json({"message":err})
}
}
async function update(req, res, next) {
  
  try {
    const user = await Student.findOne({ username: req.body.username });
    
    if (user) {
      try {
        req.body.skills=req.body.skills.split(",");
        const updates = {
          username: req.body.username,
          full_name: req.body.full_name,
          degree: req.body.degree,
          gender: req.body.gender,
          branch: req.body.branch,
          grade: req.body.grade,
          college: req.body.college,
          skills: req.body.skills,
          additional_skills: req.body.additional_skills,
          projects: req.body.projects,
          phno: req.body.phno,
          abondon:req.body.abondon
      };

      // Handle profile image
      if (req.files['profile'] && req.files['profile'][0]) {
          updates.profile = req.files['profile'][0].filename; // Use the filename
      }

      // Handle resume
      if (req.files['resume'] && req.files['resume'][0]) {
          updates.resume = req.files['resume'][0].filename; // Use the filename
      }

      // Perform the update in MongoDB
      await Student.updateOne({ username: req.body.username }, updates);
      return res.json({ message: 'Profile updated successfully' });
       
          
      
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      req.body.skills=req.body.skills.split(",");
      const newUser = new Student({
        username: req.body.username,
        full_name: req.body.full_name,
        degree: req.body.degree,
        gender: req.body.gender,
        branch: req.body.branch,
        grade: req.body.grade,
        college: req.body.college,
        skills: req.body.skills,
        additional_skills: req.body.additional_skills||null,
        projects: req.body.projects||null,
        profile: req.files['profile'] ? req.files['profile'][0].filename : null, // Use null if no file uploaded
        resume: req.files['resume'] ? req.files['resume'][0].filename : null,   // Same for resume
        phno: req.body.phno,
        abondon:false
      });

      try {
        await newUser.save();
        return res.status(200).json({ message: "Successfully created new user" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
async function getsort(req,res,next)
{
 try{
  const limit=4;
  const page=parseInt(req.query.page)||1;
  const skip=(page-1)*limit;

  const count= await Student.countDocuments();
  const users=await Student.find().sort({grade:-1}).skip(skip).limit(limit);  
  return res.status(200).json({message:users,maxpages:Math.ceil(count/limit),count:count});


 }
 catch(err)
 {
  console.log(err);
  return res.status(500).json({message:"Internal server error"});
 }
}



exports.Create=Create;
exports.getUser=getUser;
exports.newuser=newuser;
exports.update=update;
exports.getsort=getsort;

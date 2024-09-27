const mongoose=require('mongoose');
const express=require('express');
const College=require('./collegeSchema');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Student=require('../student/studentSchema');
async function Create(req,res,next)
{
try{
    const existing=await College.find();
    console.log(existing);
    if(existing.length>0)
    {
        return res.status(200).json({message:"already-users-existing"});
    }
    else{
try{
    
    for(var i=0;i<15;i++)
    {
    const newstudent = new College({
        username: 'college'+String(i+1),  
        profile:"1a411f7f-73fc-4e51-9131-6944426b1415.png",
        percentage:90+Math.abs(i-9),
        ranking:i+1
            
      });

      await newstudent.save();
    }
   return res.status(201).json({ message: 'Dummy colleges created successfully', student: newStudent });
    
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
async function get_college(req,res,next)
{
    const user=req.params.username;
    
    try{
      const user2=await College.findOne({username:user});
      if(user2)
      {
        return  res.status(200).json({message:user2});
          
      }
      else
      {
        return  res.status(400).json({message:"ur profile doesnot exist,create new one"});
      }
    }
    catch(err)
    {
      console.log(err);
    return  res.status(500).json({message:"internal server error"});
    }
}
async function  college_get_students(req,res,next)
{
    const college=req.params.username;
    const state=req.query.state||false; 
    const page=parseInt(req.query.page)||1;
    const limit=2;
    const skip=(page-1)*limit;
    
    
   

    
    try{
        const user=await College.findOne({username:college});
        if(user)
        {
            try{ var college_students=await Student.find({college:college,abondon:state});
            college_students=college_students.length;
                if(college_students>0)
                {
                   try{
                    const students=await Student.find({college:college,abondon:state}).skip(skip).limit(limit);
                    const totalPages=Math.ceil(college_students/limit);
                   // console.log({count:college_students,totalPages:totalPages,message:students})
                  return  res.status(200).json({count:college_students,totalPages:totalPages,message:students});

                   }
                   catch(err)
                   {
                    console.log(err);
                  return  res.satus(400).json({message:"internal server error"});
                   }
                }
                else
                {
                  return  res.status(400).json({message:"no-students enrolled in  this college"});
                }
            }
            catch(err)
            {
                console.log(err)
             return   res.status(400).json({message:"internal server error"});
            }

        }
        else
        {
           return res.status(404).json({message:"college didn't found,fill the profile"})
        }

    }
    catch(err)
    {console.log(err);
       return  res.status(500).json({message:"internal server error"})
    }
}
async function get_stats(req,res,next)
{
  const user=req.params.username;
  
  var stats={};
  
  try{
    const students=await Student.find({college:user,abondon:false});
    stats={...stats,student_count:await students.length}
    const students_male= students.filter(student=>student.gender==="male").length;
    const students_female= students.filter(student=>student.gender==="female").length;
    stats={...stats,students_male:students_male,students_female:students_female};
    const above_8= students.filter(student=>student.grade>=8.0).length;
    const above_9= students.filter(student=>student.grade>=9.0).length;
    stats={...stats,students_above_8:above_8,students_above_9:above_9};
    const dsa_skill= students.filter(student=>student.skills.includes('dsa')).length;
    const ml_skill= students.filter(student=>student.skills.includes('ml')).length;
    const web_dev_skill= students.filter(student=>student.skills.includes('web-dev')).length;
    stats={...stats,dsa_skill:dsa_skill,ml_skill:ml_skill,web_dev_skill:web_dev_skill};
   
    return res.status(200).json({message:stats});

  }
  catch(err)
  {
    console.log(err);
    return res.status(500).json({message:"internal server error"});
  }
}
async function newcollege(req,res,next)
{const user=req.body;
  try{
    const user1=await College.findOne({username:user.username});
    if(user1)
    {
      return res.status(400).json({message:"already-user-exist"});
    }
    const user2=await College.findOne({ranking:user.ranking});
    if(user2)
    {
      return res.status(400).json({message:"same rank exist,check ur rank properly"});

    }
    const newuser =new College({
      username:user.username,
      ranking:user.ranking,
      percentage:user.percentage,
      profile:req.file.filename
    });
    await newuser.save();
    return res.status(200).json({message:"succesfull entry"});
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).json({message:"internal server error"})
  }
  
}
async function update(req, res, next) {
  const user = req.body;

  try {
    // Check for an existing user with the same ranking
    const existingUserByRanking = await College.findOne({ ranking: user.ranking });
    if (existingUserByRanking && existingUserByRanking.username !== user.username) {
      return res.status(400).json({ message: "Same rank exists, please check your rank." });
    }

    // Check if the user already exists by username
    const existingUser = await College.findOne({ username: user.username });

    // Handle the profile picture (either from uploaded file or from request body)
    const profilePicture = req.file?.filename || user.profile;

    if (existingUser) {
      // Update the existing user's information
      await College.updateOne(
        { username: user.username },
        {
          username: user.username,
          ranking: user.ranking,
          percentage: user.percentage,
          profile: profilePicture,
        }
      );
      return res.status(200).json({ message: "Updated successfully." });
    } else {
      // Create a new user if one does not exist
      const newUser = new College({
        username: user.username,
        ranking: user.ranking,
        percentage: user.percentage,
        profile: profilePicture || null,
      });
      await newUser.save();
      return res.status(200).json({ message: "Successful entry." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function Delete(req, res, next) {
  const user = req.params.username;
  try {
    // Find the student first
    const student1 = await Student.findOne({ username: user });
    
    if (!student1) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the student's 'abondon' field by toggling its value
    const updatedStudent = await Student.findOneAndUpdate(
      { username: user },
      { $set: { abondon: !student1.abondon } },
      { new: true } // This option returns the updated document
    );
    
    return res.status(200).json({ message: "Update successful", student: updatedStudent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function getsort(req,res,next)
{
 try{
  const limit=4;
  const page=parseInt(req.query.page)||1;
  const skip=(page-1)*limit;

  const count= await College.countDocuments();
  const users=await College.find().sort({ranking:1}).skip(skip).limit(limit);  
  return res.status(200).json({message:users,maxpages:Math.ceil(count/limit),count:count});


 }
 catch(err)
 {
  console.log(err);
  return res.status(500).json({message:"Internal server error"});
 }
}


exports.Create=Create;
exports.get_college=get_college;
exports.college_get_students=college_get_students;
exports.get_stats=get_stats;
exports.newcollege=newcollege;
exports.update=update;
exports.Delete=Delete;
exports.getsort=getsort;

const express = require('express');
const Recuiter = require('./recuiterSchema');
const Student = require('../student/studentSchema');
const College = require("../college/collegeSchema");

async function Create(req, res, next) {
  skills = ["dsa", "web-dev", "app-dev", "front-end", "ml"]

  try {
    const users2 = await Recuiter.find();
    if (users2.length > 0) {
      res.status(400).json({ message: "already-recuiters exist" });
    }
    else {
      for (var i = 0; i < 15; i++) {
        const newrec = new Recuiter({
          username: "recuiter" + String(i + 1),
          skills_required: i < 5 ? [skills[i]] : [skills[0], skills[1 + Math.floor(Math.random() * 4)]],
          vacancy_Female: 2 + (i % 3),
          vacancy_Male: 3 + (i % 3),
          stipend: 20000,
          Male_applied: [],
          Female_applied: [],
          company_applied: [],
          Grade_cutoff_Male: 7.0 + (i / 10),
          Grade_cutoff_Female: 6.0 + (i / 7),
          company_rank_cutoff: 10 + Math.abs(i - 7),
          profile: "fed73c8a-50c3-42bf-a163-321bd7e998b4.png"

        })
        await newrec.save();
      }
      const users = await Recuiter.find();
      return res.status(200).json({ message: "succesfully done", Rec: users });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}
async function getRec(req, res, next) {
  try {
    const users2 = await Recuiter.findOne({ username: req.params.username });
    if (users2) {
      return res.status(200).json({ message: users2 });
    }
    else {
      return res.status(422).json({ message: "sorry- we didn't find ur profile,create one if probably" });
    }
  }

  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}
async function newrec(req, res, next) {
  const user = req.body;

  try {
    const user1 = await Recuiter.findOne({ username: user.username });
    if (user1) {
      return res.status(400).json({ message: "already-user-exist" });
    }

    const newuser = new Recuiter({
      username: user.username,
      skills_required: user.skills_required,
      vacancy_Female: user.vacancy_Female,
      vacancy_Male: user.vacancy_Male,
      stipend: user.stipend,
      Male_applied: [],
      Female_applied: [],
      company_applied: [],
      Grade_cutoff_Male: user.Grade_cutoff_Male,
      Grade_cutoff_Female: user.Grade_cutoff_Female,
      company_rank_cutoff: user.company_rank_cutoff,
      profile: req.file.filename
    });
    await newuser.save();
    const user3 = await Recuiter.findOne({ username: user.username })
    
    return res.status(200).json({ message: "successfull entry" });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" })
  }

}
async function update(req, res, next) {
  const user = req.body;
  user.Male_applied = user.Male_applied.split(",");
  user.Female_applied = user.Female_applied.split(",");
  user.company_applied = user.company_applied.split(",");


  try {
    const user1 = await Recuiter.findOne({ username: user.username });
    if (user1) {
      const user1 = await Recuiter.updateOne({ username: user.username }, {
        username: user.username,
        skills_required: user.skills_required,
        vacancy_Female: user.vacancy_Female,
        vacancy_Male: user.vacancy_Male,
        stipend: user.stipend,
        Male_applied: user.Male_applied,
        Female_applied: user.Female_applied,
        company_applied: user.company_applied,
        Grade_cutoff_Male: user.Grade_cutoff_Male,
        Grade_cutoff_Female: user.Grade_cutoff_Female,
        company_rank_cutoff: user.company_rank_cutoff,
        profile: req.file?.filename || user.profile,
      })
      const user2 = await Recuiter.find({ username: user.username });
      console.log(user2, typeof (user2[0].Male_applied));
      return res.status(400).json({ message: "successfull-update" });
    }
    else {

      const newuser = new Recuiter({
        username: user.username,
        skills_required: user.skills_required,
        vacancy_Female: user.vacancy_Female,
        vacancy_Male: user.vacancy_Male,
        stipend: user.stipend,
        Male_applied: [],
        Female_applied: [],
        company_applied: [],
        Grade_cutoff_Male: user.Grade_cutoff_Male,
        Grade_cutoff_Female: user.Grade_cutoff_Female,
        company_rank_cutoff: user.company_rank_cutoff,
        profile: req.file.filename
      });
      await newuser.save();

      return res.status(200).json({ message: "succesfull new entry" });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" })
  }

}
async function students(req, res, next) {
  const user = req.params.username;
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;


  try {
    const student = await Student.findOne({ username: user });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const gender = student.gender;

    if (gender === "male") {
      const companies = await Recuiter.countDocuments({ vacancy_Male: { $gt: 0 }, skills_required: {$not: { $elemMatch: { $nin: student.skills } }},Grade_cutoff_Male: { $lte: student.grade },Male_applied:{$nin:student.username} });
      const real = await Recuiter.find({ vacancy_Male: { $gt: 0 },skills_required: {$not: { $elemMatch: { $nin: student.skills } }}, Grade_cutoff_Male: { $lte: student.grade },Male_applied:{$nin:student.username} }).skip(skip).limit(limit)
      res.status(200).json({ maxpages: Math.ceil(companies / limit), message: real, Total: companies });
    }
    if (gender === "female") {
      const companies = await Recuiter.countDocuments({ vacancy_Female: { $gt: 0 }, skills_required: {$not: { $elemMatch: { $nin: student.skills } }}, Grade_cutoff_Female: { $lte: student.grade },Female_applied:{$nin:student.username} });
      const real = await Recuiter.find({ vacancy_Female: { $gt: 0 },skills_required: {$not: { $elemMatch: { $nin: student.skills } }}, Grade_cutoff_Female: { $lte: student.grade },Female_applied:{$nin:student.username} }).skip(skip).limit(limit)
      res.status(200).json({ maxpages: Math.ceil(companies / limit), message: real, Total: companies });
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "internal server error" });
  }
}
async function colleges(req, res, next) {
  const user = req.params.username;
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;
  try {

    const company = await College.findOne({ username: user });
    if (!(company)) {
      return res.status(400).json({ message: "user didn't found try again" });
    }
    const requiters_count = await Recuiter.countDocuments({ company_rank_cutoff: { $gte: company.ranking },company_applied:{$nin:company.username} });
    const MaxPages = Math.ceil(requiters_count / limit);
    const requiters = await Recuiter.find({ company_rank_cutoff: { $gte: company.ranking },company_applied:{$nin:company.username} }).skip(skip).limit(limit);
    return res.status(200).json({ message: requiters, maxpages: MaxPages, count: requiters_count });

  }
  catch (err) {
    console.log(err);
    res.status(200).json({ message: "Internal server error" });
  }
}
async function recstudents(req, res, next) {
  const user = req.params.username;

  try {
    const user1 = await Recuiter.findOne({ username: user });
    if (user1) {
      const page = parseInt(req.query.page) || 1;
      const limit = 2;
      const skip = (page - 1) * limit;
      const students1 = { ...user1.Male_applied, ...user1.Female_applied };
      const students = new Array()
      for (var key in students1) {
        students.push(students1[key])
      }
      const users = await Promise.all(
        students.slice(skip, skip + limit).map(async (user) => {
          return await Student.findOne({ username: user });
        })
      );
      const maxpages = Math.ceil(students.length / limit);
      const count = students.length;
      return res.status(200).json({ maxpages: maxpages, count: count, message: users });
    }
    else {
      return res.status(422).json({ message: "sorry we cannot find user" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
async function reccollege(req, res, next) {
  const user = req.params.username;

  try {
    const user1 = await Recuiter.findOne({ username: user });
    if (user1) {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;
      const students1 = { ...user1.company_applied };
      const students = new Array()
      for (var key in students1) {
        students.push(students1[key])
      }
      const users = await Promise.all(
        students.slice(skip, skip + limit).map(async (user) => {
          return await College.findOne({ username: user });
        })
      );
      const maxpages = Math.ceil(students.length / limit);
      const count = students.length;
      return res.status(200).json({ maxpages: maxpages, count: count, message: users });
    }
    else {
      return res.status(422).json({ message: "sorry we cannot find user" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
}
async function savcollege(req, res, next) {
  const rec = req.query.rec;
  const college = req.query.college;

  try {
    const coll1 = await College.findOne({ username: college });
    const rec1 = await Recuiter.findOne({ username: rec });

    if (coll1 && rec1) {
      const appliedColleges = rec1.company_applied;
      if (appliedColleges.includes(college)) {
        return res.status(400).json({ message: "already-applied" });
      }
      else {
        if (rec1.company_rank_cutoff >= coll1.ranking) {
          rec1.company_applied.push(college);
          await Recuiter.updateOne({ username: rec }, { company_applied: rec1.company_applied });
          const answer = await Recuiter.findOne({ username: rec });


          return res.status(200).json({ message: "successful update" });
        }
        else {
          return res.status(400).json({ message: "rank was too low to update" });
        }
      }


    }
    else {
      return res.status(422).json({ message: "either one of the data is not matched, check once" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}
function check_subset(parent, child) {
  for (var i = 0; i < child.length; i++)
    if (!(parent.includes(child[i]))) {
      return false;
    }
  return true;
}
async function savstudent(req, res, next) {
  const rec = req.query.rec;
  const student = req.query.student;
  const coll1 = await Student.findOne({ username: student });
  const rec1 = await Recuiter.findOne({ username: rec });
 

  try {
    if (coll1 && rec1) {
      const gender = coll1.gender;
      if (gender === "male")

        if (!(rec1.Male_applied.includes(student)) && rec1.Grade_cutoff_Male <= coll1.grade && rec1.vacancy_Male > 0 && check_subset(coll1.skills, rec1.skills_required)) 
          {
          rec1.Male_applied.push(student);
          await Recuiter.updateOne({ username: rec }, { Male_applied: rec1.Male_applied });
          return res.status(200).json({ message: "successful-application" });
        }
        else 
        {
          if ((rec1.Male_applied.includes(student))) 
            {
            return res.status(400).json({ message: "already-applied" });
          }
          if (!(rec1.Grade_cutoff_Male <= coll1.grade)) {
            return res.status(400).json({ message: "ur grade is too loo to apply" });
          }
          if (rec1.vacancy_Male == 0) {
            return res.status(400).json({ message: "no vacancies" });
          }
          if (!(check_subset(coll1.skills, rec1.skills_required))) {
            return res.status(400).json({ message: "must have additional skill set" });
          }
        }
    
    else {
      if (!(rec1.Female_applied.includes(student)) && rec1.Grade_cutoff_Female <= coll1.grade && rec1.vacancy_Female > 0 && check_subset(coll1.skills, rec1.skills_required)) {
        rec1.Female_applied.push(student);
        await Recuiter.updateOne({ username: rec }, { Female_applied: rec1.Female_applied });
        return res.status(200).json({ message: "successful-application" });
      }
      else {
        res.status(400).json({ message: "you cannot apply try to improve skills" })
      }

    }
  }
    else
  {
    res.status(422).json({ message: "either one of data is not matched,check once" })
  }



}
  catch (err) {
  console.log(err);
  res.status(500).json({ message: "internal server error" });
}

}
async function  sortstudent(req,res,next)
{
  const page = parseInt(req.query.page) || 1;
  const type="student"||req.query.type;
  const limit = 3;
  const skip = (page - 1) * limit;
  try{
    const count=await Recuiter.countDocuments();
    if(type==="student"){
    if(count>0 && skip<count)
    {
      const users = await Recuiter.find().sort({ stipend: -1, vacancy_Male: -1, vacancy_Female: -1,Grade_cutoff_Male:-1,Grade_cutoff_Female:-1 })
  .skip(skip) // Skipping records for pagination
  .limit(limit); // Limiting the number of results

const count = await Recuiter.countDocuments();

return res.status(200).json({
  message: users, 
  Total: count, 
  maxpages: Math.ceil(count / limit) 
});

    }
    else
    {
     return  res.status(400).json({message:"sorry we didn't found roles"})
    }
  }
  else
  {
    if(count>0 && skip<count)
      {
        const users = await Recuiter.find().sort({ company_rank_cutoff:-1 })
    .skip(skip) // Skipping records for pagination
    .limit(limit); // Limiting the number of results
  
  const count = await Recuiter.countDocuments();
  
  return res.status(200).json({
    message: users, 
    Total: count, 
    maxpages: Math.ceil(count / limit) 
  });
  
      }
      else
      {
       return  res.status(400).json({message:"sorry we didn't found roles"});
      }
  }


  }
  catch(err)
  {
    console.log(err);
  return   res.status(500).json({message:"internal-server-error"})  }
}
exports.Create = Create;
exports.getRec = getRec;
exports.newrec = newrec;
exports.update = update;
exports.students = students;
exports.colleges = colleges;
exports.recstudents = recstudents;
exports.reccollege = reccollege;
exports.savcollege = savcollege;
exports.savstudent = savstudent;
exports.sortstudent=sortstudent;
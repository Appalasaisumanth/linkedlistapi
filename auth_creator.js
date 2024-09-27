const mongoose = require("mongoose");
const User = require("./authSchema");
const bcrypt = require("bcrypt");
const type = ["college", "student", "recuiter"]

async function createOne(req, res, next) 
{
    try {
        const users = await User.find();  // Fetch all users
        if (users.length > 0) {
            // If there is already a user, send a response
            return res.status(200).json({ "message": "We already have a user." });
        }
        else {
            for (var i = 0; i < 15; i++) {
                var hash = await bcrypt.hash("C" + type[0].slice(1, 7) + '@123' + String(i + 1), 12);
                const user = new User({
                    username: type[0] + String(i + 1),
                    password: hash,
                    email: type[0] + String(i + 1) + "@college.ac.in",
                    type: type[0]
                })
                await user.save();
            }
            for (var i = 0; i < 150; i++) {
                hash = await bcrypt.hash("S" + type[1].slice(1, 7) + '@123' + String(i + 1), 12);
                const user = new User({
                    username: type[1] + String(i + 1),
                    password: hash,
                    email: type[1] + String(i + 1) + "@gmail.com",
                    type: type[1]
                })
                await user.save();
            }
            for (var i = 0; i < 15; i++) {
                hash = await bcrypt.hash("R" + type[2].slice(1, 8) + '@123' + String(i + 1), 12);
                const user = new User({
                    username: type[2] + String(i + 1),
                    password: hash,
                    email: type[2] + String(i + 1) + "@company.in",
                    type: type[2]
                })
                await user.save();
            }

            return res.status(200).json({ "message": "Successful creation" });
        }



    } catch (err) {
        // Handle any errors
        return res.status(500).json({ message: err.message });
    }
    return res.status(400).json({"message":"unknown error"});
}
async function login(req, res, next) {
    const data = req.body;
    try {
        const user = await User.findOne({ username: data.username });
        if (!user) {
            return res.status(400).json({ message: "user not found,signup first" });
        }
        else {
            const result = await bcrypt.compare(data.password, user.password);
            if (result) {
                //localStorage.setItem("user",body.type+"+"+body.usrname);
                return res.status(200).json({ message: "sucessfull login",result:user.type });
            }
            else {

                return res.status(400).json({ message: "Invalid credentials" });
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "internel server error,try once more" });

    }

}
async function Signup(req,res,next){
    const body=req.body;
    
    if(!(body.username && body.password && body.type && body.email))
    {
       return res.status(400).json({message:"Fill all deatails"});
    }
   try{
     const user_check=await User.findOne({username:body.username});
     if(user_check)
     {
        return res.status(400).json({message:"alraedy user exists,go and login"});
     }
     else
     {
        try{
            const temp=body.password;
            const temp2=await bcrypt.hash(temp,12);
            body.password=temp2;
            const user=new User(body);
            await user.save();
            //localStorage.setItem("user",body.type+"+"+body.usrname);
            return res.status(200).json({message:"successful_creation",result:body.type});
        }
        catch(err)
        {
            return res.status(500).json({message:"internel server error"})
        }
     }
}
catch(err)
{
    return res.status(400).json({message:"internal server error"});
}


}
// In auth_creator.js
module.exports = { createOne, login, Signup};


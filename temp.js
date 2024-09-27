const bcrypt=require("bcrypt");
async function fnction2()
{
var pass="Sumanth@1231";
var pass2="Sumanth@1231";
var temp= await bcrypt.hash(pass,12);
var temp2=await bcrypt.compare(pass2,temp);
console.log(temp,pass2,pass,temp2);
}
fnction2();
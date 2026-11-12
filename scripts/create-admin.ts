import "dotenv/config";
import bcrypt from "bcryptjs";
import {connectDB} from "../lib/db";
import User from "../models/User";

async function main(){
  const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD;
  const name=process.env.ADMIN_NAME?.trim()||"CosmoCareer Admin";
  if(!email||!password||password.length<14)throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 14 characters) in your local environment.");
  await connectDB();
  const existing=await User.findOne({email});
  if(existing){console.log("An account with this email already exists. No changes made.");return}
  const passwordHash=await bcrypt.hash(password,12);
  await User.create({name,email,passwordHash,role:"admin",preferredLanguage:"en",isActive:true});
  console.log("Admin account created. Sign in using the configured email and password.");
}
main().catch(error=>{console.error(error);process.exitCode=1});

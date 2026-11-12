import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/models/Course";
const FLAGSHIP_SLUGS=["video-editing","content-creator","ai-video-creation"];
export async function GET(){
 try{
  await connectDB();
  const courses=await Course.find({isPublished:true,slug:{$in:FLAGSHIP_SLUGS}}).select("title slug shortDescription description category level durationWeeks price language").sort({createdAt:-1}).lean();
  const displayCourses=courses.map(course=>({...course,price:30000,durationWeeks:6,language:"Bilingual"}));
  return NextResponse.json({courses:displayCourses},{headers:{"Cache-Control":"no-store"}});
 }catch(error){
  console.error("Public flagship course catalogue failed:",error);
  return NextResponse.json({error:"Course catalogue is temporarily unavailable. Please try again shortly."},{status:503,headers:{"Cache-Control":"no-store"}});
 }
}

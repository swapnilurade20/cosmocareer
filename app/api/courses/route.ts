import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/models/Course";
export async function GET(){
 await connectDB();
 const courses=await Course.find({isPublished:true}).select("title slug shortDescription description category level durationWeeks price language").sort({createdAt:-1}).lean();
 const flagship=new Set(["video-editing","content-creator","ai-video-creation"]);
 const displayCourses=courses.map(course=>flagship.has(course.slug)?{...course,price:30000,durationWeeks:6,language:"Bilingual"}:course);
 return NextResponse.json({courses:displayCourses},{headers:{"Cache-Control":"no-store"}});
}
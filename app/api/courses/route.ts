import {NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/models/Course";
export async function GET(){
 await connectDB();
 const courses=await Course.find({isPublished:true}).select("title slug shortDescription description category level durationWeeks price language").sort({createdAt:-1}).lean();
 return NextResponse.json({courses},{headers:{"Cache-Control":"no-store"}});
}
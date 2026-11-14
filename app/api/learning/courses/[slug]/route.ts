import {NextRequest,NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/models/Course";
import CourseModule,{type ICourseModule,type ILesson} from "@/models/CourseModule";
import {readSession,SESSION_COOKIE} from "@/lib/session";
import Enrollment from "@/models/Enrollment";
import LessonProgress from "@/models/LessonProgress";
import User from "@/models/User";

export async function GET(req:NextRequest,{params}:{params:Promise<{slug:string}>}){
  try{
    const {slug}=await params;
    if(!slug)return NextResponse.json({error:"A course slug is required."},{status:400});
    await connectDB();
    const course=await Course.findOne({slug,isPublished:true})
      .select("_id title slug shortDescription description category level durationWeeks price language")
      .lean();
    if(!course)return NextResponse.json({error:"This course is not published or could not be found."},{status:404});
    const token=req.cookies.get(SESSION_COOKIE)?.value;
    const session=token?await readSession(token):null;
    let enrolled=false;
    let completedLessonIds:string[]=[];
    if(session){
      const activeUser=await User.findOne({_id:session.userId,isActive:true,role:"student"})
        .select("_id")
        .lean() as unknown as ICourseModule[];
      if(activeUser){
        const enrollment=await Enrollment.findOne({
          studentId:activeUser._id,
          courseId:course._id,
          status:"active"
        }).select("_id").lean();
        enrolled=Boolean(enrollment);
        if(enrolled){
          const done=await LessonProgress.find({
            studentId:session.userId,
            courseId:course._id,
            completed:true
          }).select("lessonId").lean();
          completedLessonIds=done.map(x=>String(x.lessonId));
        }
      }
    }
    let modules:ICourseModule[]=[];
    let lessonWarning="";
    try{
      modules=await CourseModule.find({courseId:course._id})
        .select("title description order lessons")
        .sort({order:1})
        .lean() as unknown as ICourseModule[];
    }catch(moduleError){
      lessonWarning="Course lessons are being prepared. You can still view course details and enrol.";
      console.error("[GET /api/learning/courses/[slug]] lesson query failed",moduleError);
    }
    const safeModules=modules.map((m:ICourseModule)=>({
      _id:m._id,
      title:m.title,
      description:m.description,
      order:m.order,
      lessons:(m.lessons||[])
        .filter((l:ILesson)=>enrolled||l.isPreview)
        .map((l:ILesson)=>({
          _id:l._id,
          title:l.title,
          description:l.description,
          durationMinutes:l.durationMinutes,
          isPreview:Boolean(l.isPreview),
          videoUrl:enrolled||l.isPreview?l.videoUrl:"",
          isCompleted:completedLessonIds.includes(String(l._id))
        }))
    }));
    return NextResponse.json(
      {course,modules:safeModules,enrolled,lessonWarning},
      {headers:{"Cache-Control":"private, no-store, max-age=0"}}
    );
  }catch(error){
    const detail=error instanceof Error?error.message:"Unknown server error";
    console.error("[GET /api/learning/courses/[slug]]",detail);
    const publicMessage=detail.includes("MONGODB_URI")
      ?"Course database is not configured on the hosting server."
      :detail.toLowerCase().includes("auth_secret")
      ?"Login configuration is incomplete on the hosting server."
      :detail.toLowerCase().includes("timed out")||detail.toLowerCase().includes("server selection")
      ?"The course database could not be reached. Check the MongoDB Atlas connection and IP access list."
      :"Course lessons are temporarily unavailable. The course information is still available below.";
    return NextResponse.json(
      {error:publicMessage},
      {status:503,headers:{"Cache-Control":"no-store"}}
    );
  }
}

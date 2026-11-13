import {NextRequest,NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/models/Course";
import CourseModule from "@/models/CourseModule";
import {readSession,SESSION_COOKIE} from "@/lib/session";
import Enrollment from "@/models/Enrollment";
import LessonProgress from "@/models/LessonProgress";
import User from "@/models/User";

export async function GET(req:NextRequest,{params}:{params:Promise<{slug:string}>}){
  await connectDB();
  const {slug}=await params;
  const course=await Course.findOne({slug,isPublished:true})
    .select("_id title slug shortDescription description category level durationWeeks price language")
    .lean();
  if(!course)return NextResponse.json({error:"Course not found."},{status:404});
  const token=req.cookies.get(SESSION_COOKIE)?.value;
  const session=token?await readSession(token):null;
  let enrolled=false;
  let completedLessonIds:string[]=[];
  if(session){
    const activeUser=await User.findOne({_id:session.userId,isActive:true,role:"student"})
      .select("_id")
      .lean();
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
  const modules=await CourseModule.find({courseId:course._id})
    .select("title description order lessons")
    .sort({order:1})
    .lean();
  const safeModules=modules.map(m=>({
    ...m,
    lessons:m.lessons
      .filter(l=>enrolled||l.isPreview)
      .map(l=>({
        ...l,
        videoUrl:enrolled||l.isPreview?l.videoUrl:"",
        isCompleted:completedLessonIds.includes(String(l._id))
      }))
  }));
  return NextResponse.json(
    {course,modules:safeModules,enrolled},
    {headers:{"Cache-Control":"private, no-store, max-age=0"}}
  );
}

import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {requireLearner} from "@/lib/learner";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
export async function GET(req:NextRequest,{params}:{params:Promise<{slug:string}>}){const auth=await requireLearner(req);if("error" in auth)return auth.error;const {slug}=await params;const course=await Course.findOne({slug,isPublished:true}).select("_id");if(!course)return NextResponse.json({error:"Course not found."},{status:404});if(!await Enrollment.exists({studentId:auth.user._id,courseId:course._id,status:"active"}))return NextResponse.json({error:"Enrolment required."},{status:403});const quizzes=await Quiz.find({courseId:course._id,isPublished:true}).select("title questions.prompt questions.options passPercent attemptsAllowed moduleId").lean();const attempts=await QuizAttempt.find({studentId:auth.user._id,quizId:{$in:quizzes.map(q=>q._id)}}).sort({submittedAt:-1}).lean();return NextResponse.json({quizzes:quizzes.map(q=>({...q,questions:q.questions.map(x=>({prompt:x.prompt,options:x.options})),attemptsUsed:attempts.filter(a=>String(a.quizId)===String(q._id)).length,lastAttempt:attempts.find(a=>String(a.quizId)===String(q._id))||null}))});}

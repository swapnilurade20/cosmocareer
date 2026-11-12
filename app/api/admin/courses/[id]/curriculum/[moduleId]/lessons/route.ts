import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import mongoose from "mongoose";
import {requireAdmin} from "@/lib/admin";
import CourseModule from "@/models/CourseModule";
import AuditLog from "@/models/AuditLog";
const schema=z.object({title:z.string().trim().min(2).max(160),description:z.string().max(3000).default(""),videoUrl:z.string().url().or(z.literal("")).default(""),durationMinutes:z.number().int().min(0).max(1000).default(0),order:z.number().int().min(0).default(0),isPreview:z.boolean().default(false)});
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string;moduleId:string}>}){const auth=await requireAdmin(req);if("error" in auth)return auth.error;const {id,moduleId}=await params;if(!mongoose.isValidObjectId(id)||!mongoose.isValidObjectId(moduleId))return NextResponse.json({error:"Invalid course or module id."},{status:400});const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Invalid lesson details. Video URL must be a valid URL."},{status:400});const module=await CourseModule.findOneAndUpdate({_id:moduleId,courseId:id},{$push:{lessons:parsed.data}},{new:true});if(!module)return NextResponse.json({error:"Module not found."},{status:404});const lesson=module.lessons[module.lessons.length-1];await AuditLog.create({actorId:auth.session.userId,action:"curriculum.lesson.created",targetType:"course",targetId:id,details:{moduleId,lessonId:String(lesson._id),title:lesson.title}});return NextResponse.json({module},{status:201});}

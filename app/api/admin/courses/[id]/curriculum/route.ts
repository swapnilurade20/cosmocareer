import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import mongoose from "mongoose";
import {requireAdmin} from "@/lib/admin";
import Course from "@/models/Course";
import CourseModule from "@/models/CourseModule";
import AuditLog from "@/models/AuditLog";
const schema=z.object({title:z.string().trim().min(2).max(160),description:z.string().max(3000).default(""),order:z.number().int().min(0).default(0)});
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requireAdmin(req);if("error" in auth)return auth.error;const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Invalid course id."},{status:400});const modules=await CourseModule.find({courseId:id}).sort({order:1}).lean();return NextResponse.json({modules});}
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requireAdmin(req);if("error" in auth)return auth.error;const {id}=await params;if(!mongoose.isValidObjectId(id)||!await Course.exists({_id:id}))return NextResponse.json({error:"Course not found."},{status:404});const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Invalid module details."},{status:400});const module=await CourseModule.create({courseId:id,...parsed.data});await AuditLog.create({actorId:auth.session.userId,action:"curriculum.module.created",targetType:"course",targetId:id,details:{moduleId:String(module._id),title:module.title}});return NextResponse.json({module},{status:201});}

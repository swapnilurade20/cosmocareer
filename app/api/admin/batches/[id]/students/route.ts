import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {requireAdmin} from "@/lib/admin";
import Batch from "@/models/Batch";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
const schema=z.object({studentId:z.string()});
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requireAdmin(req);if("error" in auth)return auth.error;const {id}=await params;const parsed=schema.safeParse(await req.json().catch(()=>null));if(!mongoose.isValidObjectId(id)||!parsed.success||!mongoose.isValidObjectId(parsed.data.studentId))return NextResponse.json({error:"Invalid batch or student."},{status:400});const batch=await Batch.findById(id);if(!batch)return NextResponse.json({error:"Batch not found."},{status:404});const student=await User.findOne({_id:parsed.data.studentId,role:"student",isActive:true});if(!student)return NextResponse.json({error:"Active student not found."},{status:404});if(!await Enrollment.exists({studentId:student._id,courseId:batch.courseId,status:"active"}))return NextResponse.json({error:"Student must be enrolled in the batch course first."},{status:409});if(!batch.studentIds.some(x=>String(x)===String(student._id)))batch.studentIds.push(student._id);await batch.save();return NextResponse.json({batch});}

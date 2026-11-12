import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import mongoose from "mongoose";
import {requireAdmin} from "@/lib/admin";
import Course from "@/models/Course";
import Batch from "@/models/Batch";
const schema=z.object({courseId:z.string(),name:z.string().trim().min(2).max(120),startDate:z.string().datetime(),endDate:z.string().datetime().optional(),teacherId:z.string().optional()});
export async function GET(req:NextRequest){const auth=await requireAdmin(req);if("error" in auth)return auth.error;const batches=await Batch.find().populate("courseId","title").populate("teacherId","name email").populate("studentIds","name email").sort({startDate:-1}).lean();return NextResponse.json({batches});}
export async function POST(req:NextRequest){const auth=await requireAdmin(req);if("error" in auth)return auth.error;const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success||!mongoose.isValidObjectId(parsed.data?.courseId))return NextResponse.json({error:"Invalid batch details."},{status:400});if(!await Course.exists({_id:parsed.data.courseId}))return NextResponse.json({error:"Course not found."},{status:404});const batch=await Batch.create({...parsed.data,startDate:new Date(parsed.data.startDate),endDate:parsed.data.endDate?new Date(parsed.data.endDate):undefined,teacherId:parsed.data.teacherId&&mongoose.isValidObjectId(parsed.data.teacherId)?parsed.data.teacherId:undefined});return NextResponse.json({batch},{status:201});}

import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {requireLearner} from "@/lib/learner";
import Enrollment from "@/models/Enrollment";
import ProgrammeRecord from "@/models/ProgrammeRecord";
const schema=z.object({resumeUrl:z.string().url().max(1000)});
export async function PATCH(req:NextRequest){const auth=await requireLearner(req);if("error" in auth)return auth.error;const body=await req.json().catch(()=>null);const parsed=schema.safeParse(body);const courseId=typeof body?.courseId==="string"?body.courseId:"";if(!parsed.success||!mongoose.isValidObjectId(courseId))return NextResponse.json({error:"Provide a valid course and resume/portfolio URL."},{status:400});if(!await Enrollment.exists({studentId:auth.user._id,courseId,status:"active"}))return NextResponse.json({error:"Active enrolment required."},{status:403});const record=await ProgrammeRecord.findOneAndUpdate({studentId:auth.user._id,courseId},{$set:{resumeSubmitted:true,resumeUrl:parsed.data.resumeUrl}},{upsert:true,new:true,setDefaultsOnInsert:true});return NextResponse.json({record});}

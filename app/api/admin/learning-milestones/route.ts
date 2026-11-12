import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {requirePermission} from "@/lib/admin";
import ProgrammeRecord from "@/models/ProgrammeRecord";
const schema=z.object({studentId:z.string(),courseId:z.string(),finalAssessmentDone:z.boolean().optional(),finalAssessmentScore:z.number().min(0).max(100).optional(),mockInterviewCount:z.number().int().min(0).max(20).optional(),actionPlanCompleted:z.boolean().optional(),placementSupportMonths:z.number().int().min(0).max(24).optional()});
export async function GET(req:NextRequest){const auth=await requirePermission(req,"enrollments.read");if("error" in auth)return auth.error;const records=await ProgrammeRecord.find().populate("studentId","name email").populate("courseId","title slug").sort({updatedAt:-1}).limit(300).lean();return NextResponse.json({records});}
export async function PATCH(req:NextRequest){const auth=await requirePermission(req,"enrollments.manage");if("error" in auth)return auth.error;const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success||!mongoose.isValidObjectId(parsed.data?.studentId)||!mongoose.isValidObjectId(parsed.data?.courseId))return NextResponse.json({error:"Invalid programme milestone update."},{status:400});const {studentId,courseId,...changes}=parsed.data;const record=await ProgrammeRecord.findOneAndUpdate({studentId,courseId},{$set:changes},{upsert:true,new:true,setDefaultsOnInsert:true});return NextResponse.json({record,placementReady:record.mockInterviewCount>=3&&record.actionPlanCompleted});}

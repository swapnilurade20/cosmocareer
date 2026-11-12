import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {requireLearner} from "@/lib/learner";
import Assignment from "@/models/Assignment";
import Enrollment from "@/models/Enrollment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
const schema=z.object({text:z.string().max(12000).default(""),attachmentUrl:z.string().url().max(1000).or(z.literal("")).default("")}).refine(x=>x.text.trim().length>0||x.attachmentUrl.length>0);
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requireLearner(req);if("error" in auth)return auth.error;const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Invalid assignment."},{status:400});const assignment=await Assignment.findOne({_id:id,isPublished:true}).lean();if(!assignment)return NextResponse.json({error:"Assignment unavailable."},{status:404});if(!await Enrollment.exists({studentId:auth.user._id,courseId:assignment.courseId,status:"active"}))return NextResponse.json({error:"Enrolment required."},{status:403});if(assignment.dueAt&&assignment.dueAt<new Date())return NextResponse.json({error:"Submission deadline has passed."},{status:409});const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Provide written work or a valid attachment URL."},{status:400});const submission=await AssignmentSubmission.findOneAndUpdate({assignmentId:id,studentId:auth.user._id},{$set:{...parsed.data,status:"submitted",submittedAt:new Date(),score:null,feedback:"",gradedBy:null,gradedAt:null}},{upsert:true,new:true,setDefaultsOnInsert:true});return NextResponse.json({submission},{status:201});}

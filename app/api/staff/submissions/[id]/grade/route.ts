import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {requirePermission} from "@/lib/admin";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Assignment from "@/models/Assignment";
const schema=z.object({score:z.number().min(0),feedback:z.string().max(5000).default(""),status:z.enum(["graded","resubmission"]).default("graded")});
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requirePermission(req,"courses.manage");if("error" in auth)return auth.error;const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Invalid submission."},{status:400});const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid grade."},{status:400});const submission=await AssignmentSubmission.findById(id);if(!submission)return NextResponse.json({error:"Submission not found."},{status:404});const assignment=await Assignment.findById(submission.assignmentId).select("maxScore");if(!assignment||parsed.data.score>assignment.maxScore)return NextResponse.json({error:"Score exceeds assignment maximum."},{status:400});submission.score=parsed.data.score;submission.feedback=parsed.data.feedback;submission.status=parsed.data.status;submission.gradedBy=new mongoose.Types.ObjectId(auth.session.userId);submission.gradedAt=new Date();await submission.save();return NextResponse.json({submission});}

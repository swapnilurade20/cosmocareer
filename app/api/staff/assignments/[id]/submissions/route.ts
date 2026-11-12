import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {requirePermission} from "@/lib/admin";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requirePermission(req,"courses.manage");if("error" in auth)return auth.error;const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Invalid assignment."},{status:400});if(!await Assignment.exists({_id:id}))return NextResponse.json({error:"Assignment not found."},{status:404});const submissions=await AssignmentSubmission.find({assignmentId:id}).populate("studentId","name email").sort({submittedAt:1}).lean();return NextResponse.json({submissions});}

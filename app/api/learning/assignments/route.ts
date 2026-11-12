import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {requireLearner} from "@/lib/learner";
import Enrollment from "@/models/Enrollment";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
export async function GET(req:NextRequest){const auth=await requireLearner(req);if("error" in auth)return auth.error;const courseId=req.nextUrl.searchParams.get("courseId");if(!mongoose.isValidObjectId(courseId))return NextResponse.json({error:"Valid courseId required."},{status:400});if(!await Enrollment.exists({studentId:auth.user._id,courseId,status:"active"}))return NextResponse.json({error:"Enrolment required."},{status:403});const assignments=await Assignment.find({courseId,isPublished:true}).select("-createdBy").lean();const submissions=await AssignmentSubmission.find({studentId:auth.user._id,assignmentId:{$in:assignments.map(a=>a._id)}}).select("assignmentId status score feedback submittedAt gradedAt").lean();return NextResponse.json({assignments,submissions});}

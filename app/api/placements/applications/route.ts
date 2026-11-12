import {NextRequest,NextResponse} from "next/server";
import {requireLearner} from "@/lib/learner";
import JobApplication from "@/models/JobApplication";
export async function GET(req:NextRequest){const auth=await requireLearner(req);if("error" in auth)return auth.error;const rows=await JobApplication.find({studentId:auth.user._id}).populate("jobId","title company location employmentType").sort({createdAt:-1}).lean();return NextResponse.json({applications:rows.map(x=>({...x,staffNotes:undefined}))});}

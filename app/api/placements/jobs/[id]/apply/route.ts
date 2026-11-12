import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {connectDB} from "@/lib/db";
import {requireLearner} from "@/lib/learner";
import PlacementJob from "@/models/PlacementJob";
import JobApplication from "@/models/JobApplication";
const schema=z.object({resumeUrl:z.string().url().max(1500).optional().or(z.literal("")),coverLetter:z.string().max(5000).optional()});
export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requireLearner(req);if("error" in auth)return auth.error;await connectDB();const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Invalid job."},{status:400});const job=await PlacementJob.findOne({_id:id,isPublished:true,$or:[{applyBy:{$exists:false}},{applyBy:null},{applyBy:{$gte:new Date()} }]});if(!job)return NextResponse.json({error:"This opportunity is unavailable or closed."},{status:404});const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Check your application details."},{status:400});try{const application=await JobApplication.create({jobId:id,studentId:auth.user._id,resumeUrl:parsed.data.resumeUrl||undefined,coverLetter:parsed.data.coverLetter||"",status:"applied",statusHistory:[{status:"applied",changedBy:String(auth.user._id),note:"Application submitted"}]});return NextResponse.json({application:{id:application._id,status:application.status}},{status:201})}catch(e){if(e instanceof Error&&"code" in e&&(e as Error&{code?:number}).code===11000)return NextResponse.json({error:"You have already applied for this opportunity."},{status:409});throw e}}

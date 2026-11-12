import {NextRequest,NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import {requirePermission} from "@/lib/admin";
import JobApplication from "@/models/JobApplication";
import AuditLog from "@/models/AuditLog";
const schema=z.object({status:z.enum(["screening","interview","offered","hired","rejected","withdrawn"]),staffNotes:z.string().max(5000).optional(),interviewAt:z.string().datetime().optional()});
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await requirePermission(req,"placements.manage");if("error" in auth)return auth.error;const {id}=await params;if(!mongoose.isValidObjectId(id))return NextResponse.json({error:"Invalid application."},{status:400});const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid application update."},{status:400});const app=await JobApplication.findById(id);if(!app)return NextResponse.json({error:"Application not found."},{status:404});app.status=parsed.data.status;if(parsed.data.staffNotes!==undefined)app.staffNotes=parsed.data.staffNotes;if(parsed.data.interviewAt)app.interviewAt=new Date(parsed.data.interviewAt);app.statusHistory.push({status:parsed.data.status,note:parsed.data.staffNotes,changedBy:auth.session.userId,changedAt:new Date()});await app.save();await AuditLog.create({actorId:auth.session.userId,action:"placement.application.updated",targetType:"jobApplication",targetId:id,details:{status:app.status}});return NextResponse.json({application:app})}

import {NextRequest,NextResponse} from "next/server";
import {requirePermission} from "@/lib/admin";
import JobApplication from "@/models/JobApplication";
export async function GET(req:NextRequest){const auth=await requirePermission(req,"placements.manage");if("error" in auth)return auth.error;const status=req.nextUrl.searchParams.get("status");const filter=status?{status}:{};const applications=await JobApplication.find(filter).populate("studentId","name email phone").populate("jobId","title company location").sort({updatedAt:-1}).limit(500).lean();return NextResponse.json({applications})}

import {NextRequest,NextResponse} from "next/server";
import {requireLearner} from "@/lib/learner";
import Certificate from "@/models/Certificate";
export async function GET(req:NextRequest){const auth=await requireLearner(req);if("error" in auth)return auth.error;const certificates=await Certificate.find({studentId:auth.user._id}).populate("courseId","title").sort({issuedAt:-1}).lean();return NextResponse.json({certificates:certificates.map(c=>({certificateNumber:c.certificateNumber,issuedAt:c.issuedAt,status:c.status,course:c.courseId,verificationUrl:new URL("/verify-certificate/"+c.verificationCode,req.nextUrl.origin).toString()}))});}

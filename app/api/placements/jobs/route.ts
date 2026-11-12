import {NextRequest,NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import PlacementJob from "@/models/PlacementJob";
import {readSession,SESSION_COOKIE} from "@/lib/session";
import User from "@/models/User";
export async function GET(req:NextRequest){await connectDB();const token=req.cookies.get(SESSION_COOKIE)?.value;const session=token?await readSession(token):null;if(!session)return NextResponse.json({error:"Sign in to view placement opportunities."},{status:401});const user=await User.findById(session.userId).select("role isActive").lean();if(!user||!user.isActive||user.role!=="student")return NextResponse.json({error:"Active student account required."},{status:403});const jobs=await PlacementJob.find({isPublished:true,$or:[{applyBy:{$exists:false}},{applyBy:null},{applyBy:{$gte:new Date()}}]}).select("-createdBy").sort({createdAt:-1}).limit(100).lean();return NextResponse.json({jobs});}

import {NextRequest,NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import {readSession,SESSION_COOKIE} from "@/lib/session";
import User from "@/models/User";
export async function requireLearner(req:NextRequest){const token=req.cookies.get(SESSION_COOKIE)?.value;const session=token?await readSession(token):null;if(!session)return {error:NextResponse.json({error:"Sign in required."},{status:401})};await connectDB();const user=await User.findById(session.userId);if(!user||!user.isActive||user.role!=="student")return {error:NextResponse.json({error:"Active student account required."},{status:403})};return {session,user};}

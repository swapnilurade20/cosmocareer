import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {createSession,SESSION_COOKIE,createSupabaseIdentity,authenticateSupabase} from "@/lib/session";
const schema=z.object({email:z.string().trim().email(),password:z.string().min(1).max(72)});
export async function POST(req:NextRequest){
  try{
    const p=schema.safeParse(await req.json());
    if(!p.success)return NextResponse.json({error:"Enter a valid email and password."},{status:400});
    await connectDB();
    const email=p.data.email.toLowerCase();
    const user=await User.findOne({email}).select("+passwordHash");
    if(!user||!user.isActive)return NextResponse.json({error:"Email or password is incorrect."},{status:401});
    let supabaseUserId=user.supabaseUserId;
    if(!supabaseUserId){
      // One-time migration: verify the legacy MongoDB bcrypt password before provisioning Supabase Auth.
      if(!(await bcrypt.compare(p.data.password,user.passwordHash)))return NextResponse.json({error:"Email or password is incorrect."},{status:401});
      try{supabaseUserId=await createSupabaseIdentity(email,p.data.password,user.name)}
      catch{const existingAuthUser=await authenticateSupabase(email,p.data.password);supabaseUserId=existingAuthUser.id}
      user.supabaseUserId=supabaseUserId;
      await user.save();
    }
    const authUser=await authenticateSupabase(email,p.data.password);
    if(authUser.id!==supabaseUserId)return NextResponse.json({error:"This account's authentication link needs administrator review."},{status:403});
    const token=await createSession({userId:String(user._id),role:user.role,email:user.email});
    const res=NextResponse.json({user:{id:String(user._id),name:user.name,email:user.email,role:user.role}});
    res.cookies.set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});
    return res;
  }catch(e){console.error("Login error",e);return NextResponse.json({error:e instanceof Error&&e.message.includes("Supabase")?e.message:"Unable to sign in. Please check your email and password."},{status:500})}
}

import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {createSession,SESSION_COOKIE,createSupabaseIdentity,getSupabaseAdmin,authenticateSupabase} from "@/lib/session";
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),password:z.string().min(10).max(72),phone:z.string().trim().max(20).optional(),preferredLanguage:z.enum(["en","hi"]).default("en")});
export async function POST(req:NextRequest){
  try{
    const parsed=schema.safeParse(await req.json());
    if(!parsed.success)return NextResponse.json({error:"Check your details. Password must be at least 10 characters."},{status:400});
    await connectDB();
    const email=parsed.data.email.toLowerCase();
    if(await User.exists({email}))return NextResponse.json({error:"An account with this email already exists. Please sign in."},{status:409});
    const passwordHash=await bcrypt.hash(parsed.data.password,12);
    const user=await User.create({...parsed.data,email,passwordHash,role:"student"});
    try{
      let supabaseId:string;
      try{supabaseId=await createSupabaseIdentity(email,parsed.data.password,parsed.data.name)}
      catch(createError){
        // Recover safely if an earlier attempt created the Auth identity but failed before linking it.
        const authUser=await authenticateSupabase(email,parsed.data.password);
        supabaseId=authUser.id;
      }
      user.supabaseUserId=supabaseId;
      await user.save();
      const token=await createSession({userId:String(user._id),role:user.role,email:user.email});
      const res=NextResponse.json({user:{id:String(user._id),name:user.name,email:user.email,role:user.role}},{status:201});
      res.cookies.set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});
      return res;
    }catch(authError){
      await User.deleteOne({_id:user._id});
      throw authError;
    }
  }catch(e){console.error("Register error",e);return NextResponse.json({error:e instanceof Error&&e.message.includes("Supabase")?e.message:"Unable to create account. Please check the server authentication configuration."},{status:500})}
}

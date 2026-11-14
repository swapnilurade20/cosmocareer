import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {createSession,SESSION_COOKIE} from "@/lib/session";
import {getSupabaseAdmin} from "@/lib/supabase-auth";

const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),password:z.string().min(10).max(72),phone:z.string().trim().max(20).optional(),preferredLanguage:z.enum(["en","hi"]).default("en")});

export async function POST(req:NextRequest){
  let createdAuthUserId:string|undefined;
  try{
    const parsed=schema.safeParse(await req.json());
    if(!parsed.success)return NextResponse.json({error:"Check your details. Password must be at least 10 characters."},{status:400});
    await connectDB();
    const email=parsed.data.email.toLowerCase();
    if(await User.exists({email}))return NextResponse.json({error:"An account with this email already exists. Please sign in instead."},{status:409});

    const admin=getSupabaseAdmin();
    const {data:authData,error:authError}=await admin.auth.admin.createUser({
      email,password:parsed.data.password,email_confirm:true,
      user_metadata:{name:parsed.data.name,phone:parsed.data.phone||"",preferred_language:parsed.data.preferredLanguage}
    });
    if(authError){
      if(/already|registered|exists/i.test(authError.message))return NextResponse.json({error:"An account with this email already exists. Please sign in instead."},{status:409});
      console.error("Supabase registration error",authError);
      return NextResponse.json({error:"Unable to create your account with the authentication service."},{status:502});
    }
    if(!authData.user)throw new Error("Supabase did not return the new user.");
    createdAuthUserId=authData.user.id;

    const user=await User.create({
      ...parsed.data,email,passwordHash:"SUPABASE_AUTH_MANAGED",supabaseUserId:authData.user.id,role:"student",isActive:true
    });
    createdAuthUserId=undefined;
    const token=await createSession({userId:String(user._id),role:user.role,email:user.email});
    const res=NextResponse.json({user:{id:String(user._id),name:user.name,email:user.email,role:user.role}},{status:201});
    res.cookies.set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});
    return res;
  }catch(e){
    if(createdAuthUserId){
      try{await getSupabaseAdmin().auth.admin.deleteUser(createdAuthUserId)}catch(cleanupError){console.error("Supabase registration rollback failed",cleanupError)}
    }
    console.error("Register error",e);
    return NextResponse.json({error:e instanceof Error&&e.message.includes("Supabase")?e.message:"Unable to create account. Please try again."},{status:500});
  }
}

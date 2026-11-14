import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import {createSession,SESSION_COOKIE} from "@/lib/session";
import {ensureSupabaseUser,getSupabasePublic} from "@/lib/supabase-auth";

const schema=z.object({email:z.string().trim().email(),password:z.string().min(1).max(72)});

export async function POST(req:NextRequest){
  try{
    const parsed=schema.safeParse(await req.json());
    if(!parsed.success)return NextResponse.json({error:"Enter a valid email and password."},{status:400});
    await connectDB();
    const email=parsed.data.email.toLowerCase();
    const user=await User.findOne({email}).select("+passwordHash");
    if(!user||!user.isActive)return NextResponse.json({error:"Email or password is incorrect."},{status:401});

    const supabase=getSupabasePublic();
    let signedIn=await supabase.auth.signInWithPassword({email,password:parsed.data.password});

    if(signedIn.error){
      const legacyHash=user.passwordHash;
      const hasLegacyHash=Boolean(legacyHash)&&legacyHash!=="SUPABASE_AUTH_MANAGED";
      if(!hasLegacyHash||!(await bcrypt.compare(parsed.data.password,legacyHash))){
        return NextResponse.json({error:"Email or password is incorrect."},{status:401});
      }
      const authUser=await ensureSupabaseUser(email,parsed.data.password,{name:user.name,role:user.role});
      if(user.supabaseUserId!==authUser.id){user.supabaseUserId=authUser.id;await user.save()}
      signedIn=await supabase.auth.signInWithPassword({email,password:parsed.data.password});
    }else if(signedIn.data.user&&user.supabaseUserId!==signedIn.data.user.id){
      user.supabaseUserId=signedIn.data.user.id;
      await user.save();
    }

    if(signedIn.error||!signedIn.data.user)return NextResponse.json({error:"Unable to verify your account. Please try again."},{status:502});
    const token=await createSession({userId:String(user._id),role:user.role,email:user.email});
    const res=NextResponse.json({user:{id:String(user._id),name:user.name,email:user.email,role:user.role}});
    res.cookies.set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});
    return res;
  }catch(e){
    console.error("Login error",e);
    return NextResponse.json({error:e instanceof Error&&e.message.includes("Supabase")?e.message:"Unable to sign in. Please try again."},{status:500});
  }
}

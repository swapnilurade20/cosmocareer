import {NextRequest,NextResponse} from "next/server";
import {requireLearner} from "@/lib/learner";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import Enrollment from "@/models/Enrollment";
import {randomUUID} from "crypto";

const flagship=["video-editing","content-creator","ai-video-creation"];
export async function POST(req:NextRequest){
 try{
  const auth=await requireLearner(req);if("error" in auth)return auth.error;
  const body=await req.json().catch(()=>({}));
  const courseId=typeof body.courseId==="string"?body.courseId:"";
  const slug=typeof body.slug==="string"?body.slug:"";
  if(!/^[a-f\d]{24}$/i.test(courseId)&&!flagship.includes(slug))return NextResponse.json({error:"Choose a valid course."},{status:400});
  const course=await Course.findOne({...(courseId?{_id:courseId}:{slug}),isPublished:true}).select("_id slug title");
  if(!course||!flagship.includes(course.slug))return NextResponse.json({error:"This course is not available for online checkout."},{status:404});
  const existing=await Enrollment.findOne({studentId:auth.user._id,courseId:course._id,status:"active"}).select("_id");
  if(existing)return NextResponse.json({error:"You are already enrolled in this course."},{status:409});
  const keyId=process.env.RAZORPAY_KEY_ID,secret=process.env.RAZORPAY_KEY_SECRET;
  if(!keyId||!secret)return NextResponse.json({error:"Online payments are not configured yet. Please contact CosmoCareer."},{status:503});
  const receipt=("cc_"+randomUUID().replace(/-/g,"")).slice(0,40);
  const amount=3000000;
  const response=await fetch("https://api.razorpay.com/v1/orders",{method:"POST",headers:{Authorization:"Basic "+Buffer.from(keyId+":"+secret).toString("base64"),"Content-Type":"application/json"},body:JSON.stringify({amount,currency:"INR",receipt,notes:{studentId:String(auth.user._id),courseId:String(course._id),courseSlug:course.slug}}),cache:"no-store"});
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.id){console.error("Razorpay order creation failed",data);return NextResponse.json({error:"Unable to start payment. Please try again."},{status:502});}
  await Payment.create({studentId:auth.user._id,courseId:course._id,amount:30000,currency:"INR",status:"created",razorpayOrderId:data.id});
  return NextResponse.json({keyId,orderId:data.id,amount:data.amount,currency:data.currency,courseName:course.title});
 }catch(error){console.error("Course checkout order error",error);return NextResponse.json({error:"Unable to start checkout. Please try again."},{status:500});}
}

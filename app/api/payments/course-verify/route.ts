import {NextRequest,NextResponse} from "next/server";
import {createHmac,timingSafeEqual} from "crypto";
import {requireLearner} from "@/lib/learner";
import Payment from "@/models/Payment";
import Enrollment from "@/models/Enrollment";

export async function POST(req:NextRequest){
 try{
  const auth=await requireLearner(req);if("error" in auth)return auth.error;
  const body=await req.json().catch(()=>({}));
  const orderId=typeof body.razorpay_order_id==="string"?body.razorpay_order_id:"";
  const paymentId=typeof body.razorpay_payment_id==="string"?body.razorpay_payment_id:"";
  const signature=typeof body.razorpay_signature==="string"?body.razorpay_signature:"";
  if(!orderId||!paymentId||!signature)return NextResponse.json({error:"Payment details are incomplete."},{status:400});
  const secret=process.env.RAZORPAY_KEY_SECRET;if(!secret)return NextResponse.json({error:"Payment verification is not configured."},{status:503});
  const payment=await Payment.findOne({razorpayOrderId:orderId,studentId:auth.user._id,status:{$in:["created","paid"]}});
  if(!payment)return NextResponse.json({error:"This payment order was not found for your account."},{status:404});
  const expected=createHmac("sha256",secret).update(orderId+"|"+paymentId).digest("hex");
  const a=Buffer.from(expected,"hex"),b=Buffer.from(signature,"hex");
  if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:"Payment signature could not be verified."},{status:400});
  const keyId=process.env.RAZORPAY_KEY_ID;if(!keyId)return NextResponse.json({error:"Payment verification is not configured."},{status:503});
  const check=await fetch("https://api.razorpay.com/v1/payments/"+encodeURIComponent(paymentId),{headers:{Authorization:"Basic "+Buffer.from(keyId+":"+secret).toString("base64")},cache:"no-store"});
  const paymentData=await check.json().catch(()=>null);
  if(!check.ok||paymentData?.order_id!==orderId||paymentData?.status!=="captured"||paymentData?.amount!==payment.amount*100||paymentData?.currency!=="INR")return NextResponse.json({error:"Payment is not yet captured. If money was deducted, contact support with your payment ID."},{status:409});
  payment.status="paid";payment.razorpayPaymentId=paymentId;payment.razorpaySignature=signature;payment.paidAt=new Date();await payment.save();
  const enrollment=await Enrollment.findOneAndUpdate({studentId:auth.user._id,courseId:payment.courseId},{studentId:auth.user._id,courseId:payment.courseId,status:"active",source:"payment",enrolledAt:new Date()},{upsert:true,new:true,setDefaultsOnInsert:true});
  return NextResponse.json({success:true,enrollment});
 }catch(error){console.error("Course payment verification error",error);return NextResponse.json({error:"We could not confirm enrolment yet. Please contact support before making another payment."},{status:500});}
}

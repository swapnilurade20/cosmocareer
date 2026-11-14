import {NextRequest,NextResponse} from "next/server";
import {connectDB} from "@/lib/db";
import {requirePermission} from "@/lib/admin";
import Payment from "@/models/Payment";

export async function GET(req:NextRequest){
 const auth=await requirePermission(req,"reports.read");
 if("error" in auth)return auth.error;
 await connectDB();
 const params=req.nextUrl.searchParams;
 const status=params.get("status")||"all";
 const search=(params.get("q")||"").trim().slice(0,120);
 const filter:Record<string,unknown>={};
 if(["created","paid","failed","refunded"].includes(status))filter.status=status;
 if(search){
  const rx=new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");
  const [users,courses]=await Promise.all([
   (await import("@/models/User")).default.find({$or:[{name:rx},{email:rx}]}).select("_id").limit(100).lean(),
   (await import("@/models/Course")).default.find({$or:[{title:rx},{slug:rx}]}).select("_id").limit(100).lean()
  ]);
  const ids=[...users.map((x:any)=>x._id),...courses.map((x:any)=>x._id)];
  filter.$or=[{razorpayOrderId:rx},{razorpayPaymentId:rx},{studentId:{$in:users.map((x:any)=>x._id)}},{courseId:{$in:courses.map((x:any)=>x._id)}}];
  if(!ids.length)filter.$or=[{razorpayOrderId:rx},{razorpayPaymentId:rx}];
 }
 const [payments,total,summary]=await Promise.all([
  Payment.find(filter).populate("studentId","name email phone").populate("courseId","title slug").sort({createdAt:-1}).limit(500).lean(),
  Payment.countDocuments(filter),
  Payment.aggregate([{$group:{_id:"$status",count:{$sum:1},amount:{$sum:"$amount"}}}])
 ]);
 const stats={count:0,paidCount:0,paidAmount:0,pendingCount:0,failedCount:0,refundedCount:0};
 for(const row of summary){stats.count+=row.count;if(row._id==="paid"){stats.paidCount=row.count;stats.paidAmount=row.amount}if(row._id==="created")stats.pendingCount=row.count;if(row._id==="failed")stats.failedCount=row.count;if(row._id==="refunded")stats.refundedCount=row.count}
 return NextResponse.json({payments,total,stats,limit:500});
}

import mongoose,{Schema,type Model} from "mongoose";
export type PaymentStatus="created"|"paid"|"failed"|"refunded";
export interface IPayment{studentId:mongoose.Types.ObjectId;courseId:mongoose.Types.ObjectId;amount:number;currency:"INR";status:PaymentStatus;razorpayOrderId:string;razorpayPaymentId?:string;razorpaySignature?:string;paidAt?:Date}
const schema=new Schema<IPayment>({studentId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},amount:{type:Number,required:true,min:1},currency:{type:String,enum:["INR"],default:"INR"},status:{type:String,enum:["created","paid","failed","refunded"],default:"created",index:true},razorpayOrderId:{type:String,required:true,unique:true,index:true},razorpayPaymentId:{type:String,unique:true,sparse:true},razorpaySignature:String,paidAt:Date},{timestamps:true});
schema.index({studentId:1,courseId:1,status:1});
const Payment:Model<IPayment>=mongoose.models.Payment||mongoose.model<IPayment>("Payment",schema);
export default Payment;

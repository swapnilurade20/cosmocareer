import mongoose,{Schema,type Model} from "mongoose";
export interface ICertificate{studentId:mongoose.Types.ObjectId;courseId:mongoose.Types.ObjectId;certificateNumber:string;verificationCode:string;issuedAt:Date;status:"valid"|"revoked"}
const schema=new Schema<ICertificate>({studentId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},certificateNumber:{type:String,required:true,unique:true},verificationCode:{type:String,required:true,unique:true,index:true},issuedAt:{type:Date,default:Date.now},status:{type:String,enum:["valid","revoked"],default:"valid"}},{timestamps:true});
schema.index({studentId:1,courseId:1},{unique:true});
const Certificate:Model<ICertificate>=mongoose.models.Certificate||mongoose.model<ICertificate>("Certificate",schema);export default Certificate;

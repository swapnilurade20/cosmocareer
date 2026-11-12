import mongoose,{Schema,type Model} from "mongoose";
export interface IEnrollment { studentId:mongoose.Types.ObjectId; courseId:mongoose.Types.ObjectId; status:"active"|"completed"|"cancelled"; enrolledAt:Date; completedAt?:Date; source:"free"|"admin"|"payment" }
const schema=new Schema<IEnrollment>({studentId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},status:{type:String,enum:["active","completed","cancelled"],default:"active"},enrolledAt:{type:Date,default:Date.now},completedAt:Date,source:{type:String,enum:["free","admin","payment"],default:"free"}},{timestamps:true});
schema.index({studentId:1,courseId:1},{unique:true});
const Enrollment:Model<IEnrollment>=mongoose.models.Enrollment||mongoose.model<IEnrollment>("Enrollment",schema);
export default Enrollment;

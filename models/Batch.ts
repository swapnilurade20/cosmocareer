import mongoose,{Schema,type Model} from "mongoose";
export interface IBatch{courseId:mongoose.Types.ObjectId;name:string;startDate:Date;endDate?:Date;teacherId?:mongoose.Types.ObjectId;studentIds:mongoose.Types.ObjectId[];status:"upcoming"|"active"|"completed"|"cancelled"}
const schema=new Schema<IBatch>({courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},name:{type:String,required:true,trim:true,maxlength:120},startDate:{type:Date,required:true},endDate:Date,teacherId:{type:Schema.Types.ObjectId,ref:"User"},studentIds:[{type:Schema.Types.ObjectId,ref:"User"}],status:{type:String,enum:["upcoming","active","completed","cancelled"],default:"upcoming"}},{timestamps:true});
schema.index({courseId:1,name:1},{unique:true});
const Batch:Model<IBatch>=mongoose.models.Batch||mongoose.model<IBatch>("Batch",schema);export default Batch;

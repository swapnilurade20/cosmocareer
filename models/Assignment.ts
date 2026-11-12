import mongoose,{Schema,type Model} from "mongoose";
export interface IAssignment { courseId:mongoose.Types.ObjectId; moduleId?:mongoose.Types.ObjectId; title:string; instructions:string; dueAt?:Date; maxScore:number; isPublished:boolean; createdBy:mongoose.Types.ObjectId }
const schema=new Schema<IAssignment>({courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},moduleId:{type:Schema.Types.ObjectId,ref:"CourseModule"},title:{type:String,required:true,trim:true,maxlength:160},instructions:{type:String,required:true,maxlength:10000},dueAt:Date,maxScore:{type:Number,min:1,max:1000,default:100},isPublished:{type:Boolean,default:false},createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true}},{timestamps:true});
const Assignment:Model<IAssignment>=mongoose.models.Assignment||mongoose.model<IAssignment>("Assignment",schema);
export default Assignment;

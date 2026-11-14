import mongoose,{Schema,type Model} from "mongoose";
export interface ILesson { _id?:mongoose.Types.ObjectId; title:string; description:string; videoUrl:string; durationMinutes:number; order:number; isPreview:boolean }
export interface ICourseModule { _id?:mongoose.Types.ObjectId; courseId:mongoose.Types.ObjectId; title:string; description:string; order:number; lessons:ILesson[] }
const lessonSchema=new Schema<ILesson>({title:{type:String,required:true,trim:true,maxlength:160},description:{type:String,default:"",maxlength:3000},videoUrl:{type:String,default:""},durationMinutes:{type:Number,min:0,max:1000,default:0},order:{type:Number,min:0,default:0},isPreview:{type:Boolean,default:false}});
const schema=new Schema<ICourseModule>({courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:160},description:{type:String,default:"",maxlength:3000},order:{type:Number,min:0,default:0},lessons:{type:[lessonSchema],default:[]}},{timestamps:true});
schema.index({courseId:1,order:1});
const CourseModule:Model<ICourseModule>=mongoose.models.CourseModule||mongoose.model<ICourseModule>("CourseModule",schema);
export default CourseModule;

import mongoose,{Schema,type Model} from "mongoose";
export interface ILessonProgress { studentId:mongoose.Types.ObjectId; courseId:mongoose.Types.ObjectId; moduleId:mongoose.Types.ObjectId; lessonId:mongoose.Types.ObjectId; watchedSeconds:number; durationSeconds:number; progressPercent:number; completed:boolean; lastWatchedAt:Date }
const schema=new Schema<ILessonProgress>({studentId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},moduleId:{type:Schema.Types.ObjectId,ref:"CourseModule",required:true},lessonId:{type:Schema.Types.ObjectId,required:true},watchedSeconds:{type:Number,min:0,default:0},durationSeconds:{type:Number,min:0,default:0},progressPercent:{type:Number,min:0,max:100,default:0},completed:{type:Boolean,default:false},lastWatchedAt:{type:Date,default:Date.now}},{timestamps:true});
schema.index({studentId:1,lessonId:1},{unique:true});
const LessonProgress:Model<ILessonProgress>=mongoose.models.LessonProgress||mongoose.model<ILessonProgress>("LessonProgress",schema);
export default LessonProgress;

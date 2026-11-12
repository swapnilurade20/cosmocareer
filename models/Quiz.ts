import mongoose,{Schema,type Model} from "mongoose";
export interface IQuizQuestion { prompt:string; options:string[]; correctOption:number; explanation:string }
export interface IQuiz { courseId:mongoose.Types.ObjectId; moduleId?:mongoose.Types.ObjectId; title:string; questions:IQuizQuestion[]; passPercent:number; attemptsAllowed:number; isPublished:boolean; createdBy:mongoose.Types.ObjectId }
const questionSchema=new Schema<IQuizQuestion>({prompt:{type:String,required:true,maxlength:1000},options:{type:[String],validate:(v:string[])=>v.length>=2&&v.length<=6},correctOption:{type:Number,min:0,required:true},explanation:{type:String,default:"",maxlength:1000}});
const schema=new Schema<IQuiz>({courseId:{type:Schema.Types.ObjectId,ref:"Course",required:true,index:true},moduleId:{type:Schema.Types.ObjectId,ref:"CourseModule"},title:{type:String,required:true,trim:true,maxlength:160},questions:{type:[questionSchema],default:[]},passPercent:{type:Number,min:0,max:100,default:70},attemptsAllowed:{type:Number,min:1,max:20,default:3},isPublished:{type:Boolean,default:false},createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true}},{timestamps:true});
const Quiz:Model<IQuiz>=mongoose.models.Quiz||mongoose.model<IQuiz>("Quiz",schema);
export default Quiz;

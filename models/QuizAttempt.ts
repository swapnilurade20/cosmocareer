import mongoose,{Schema,type Model} from "mongoose";
export interface IQuizAttempt{quizId:mongoose.Types.ObjectId;studentId:mongoose.Types.ObjectId;answers:number[];scorePercent:number;passed:boolean;submittedAt:Date}
const schema=new Schema<IQuizAttempt>({quizId:{type:Schema.Types.ObjectId,ref:"Quiz",required:true,index:true},studentId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},answers:{type:[Number],default:[]},scorePercent:{type:Number,min:0,max:100,required:true},passed:{type:Boolean,required:true},submittedAt:{type:Date,default:Date.now}},{timestamps:true});
schema.index({quizId:1,studentId:1,submittedAt:-1});
const QuizAttempt:Model<IQuizAttempt>=mongoose.models.QuizAttempt||mongoose.model<IQuizAttempt>("QuizAttempt",schema);export default QuizAttempt;

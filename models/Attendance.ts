import mongoose,{Schema,type Model} from "mongoose";
export interface IAttendance{batchId:mongoose.Types.ObjectId;studentId:mongoose.Types.ObjectId;sessionDate:Date;status:"present"|"absent"|"late"|"excused";markedBy:mongoose.Types.ObjectId;notes:string}
const schema=new Schema<IAttendance>({batchId:{type:Schema.Types.ObjectId,ref:"Batch",required:true,index:true},studentId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},sessionDate:{type:Date,required:true},status:{type:String,enum:["present","absent","late","excused"],required:true},markedBy:{type:Schema.Types.ObjectId,ref:"User",required:true},notes:{type:String,default:"",maxlength:1000}},{timestamps:true});
schema.index({batchId:1,studentId:1,sessionDate:1},{unique:true});
const Attendance:Model<IAttendance>=mongoose.models.Attendance||mongoose.model<IAttendance>("Attendance",schema);export default Attendance;

import mongoose,{Schema,type Model} from "mongoose";
export interface INotification{userId:mongoose.Types.ObjectId;title:string;message:string;href?:string;category:"placement"|"learning"|"account"|"general";readAt?:Date}
const schema=new Schema<INotification>({userId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,maxlength:140},message:{type:String,required:true,maxlength:1000},href:{type:String,maxlength:300},category:{type:String,enum:["placement","learning","account","general"],default:"general"},readAt:Date},{timestamps:true});
schema.index({userId:1,readAt:1,createdAt:-1});
const Notification:Model<INotification>=mongoose.models.Notification||mongoose.model<INotification>("Notification",schema);export default Notification;
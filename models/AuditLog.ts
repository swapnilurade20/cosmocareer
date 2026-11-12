import mongoose,{Schema,type Model} from "mongoose";
export interface IAuditLog{actorId:string;action:string;targetType:string;targetId:string;details?:Record<string,unknown>}
const schema=new Schema<IAuditLog>({actorId:{type:String,required:true,index:true},action:{type:String,required:true},targetType:{type:String,required:true},targetId:{type:String,required:true},details:{type:Schema.Types.Mixed}}, {timestamps:true});
const AuditLog:Model<IAuditLog>=mongoose.models.AuditLog||mongoose.model<IAuditLog>("AuditLog",schema);
export default AuditLog;

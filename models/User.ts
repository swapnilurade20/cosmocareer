import mongoose,{Schema,type Model} from "mongoose";
export type UserRole="student"|"teacher"|"employee"|"counsellor"|"admin";
export interface IUser{name:string;email:string;phone?:string;passwordHash:string;role:UserRole;preferredLanguage:"en"|"hi";isActive:boolean}
const schema=new Schema<IUser>({name:{type:String,required:true,trim:true,maxlength:100},email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},phone:{type:String,trim:true,maxlength:20},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:["student","teacher","employee","counsellor","admin"],default:"student",required:true},preferredLanguage:{type:String,enum:["en","hi"],default:"en"},isActive:{type:Boolean,default:true}}, {timestamps:true});
const User:Model<IUser>=mongoose.models.User||mongoose.model<IUser>("User",schema);
export default User;

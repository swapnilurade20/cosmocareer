import mongoose from "mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
function escapeHtml(value:string){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]||c))}
export async function notifyUser(input:{userId:mongoose.Types.ObjectId|string;title:string;message:string;href?:string;category?:"placement"|"learning"|"account"|"general";email?:boolean}){
 const id=input.userId;
 const notification=await Notification.create({userId:id,title:input.title.slice(0,140),message:input.message.slice(0,1000),href:input.href,category:input.category||"general"});
 if(input.email===false||!process.env.RESEND_API_KEY||!process.env.RESEND_FROM_EMAIL)return notification;
 try{
  const user=await User.findById(id).select("name email").lean();
  if(user?.email){
   const base=(process.env.NEXT_PUBLIC_APP_URL||"").replace(/\/$/,"");
   const link=input.href&&base?base+input.href:base;
   const html="<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto\"><h2>"+escapeHtml(input.title)+"</h2><p>"+escapeHtml(input.message)+"</p>"+(link?"<p><a href=\""+escapeHtml(link)+"\">Open CosmoCareer</a></p>":"")+"</div>";
   const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL,to:[user.email],subject:input.title,text:input.message+(link?"\n\n"+link:""),html})});
   if(!response.ok)console.error("Resend notification failed",response.status,await response.text());
  }
 }catch(error){console.error("Notification email error",error)}
 return notification;
}
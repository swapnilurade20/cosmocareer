import {NextRequest,NextResponse} from "next/server";
import nodemailer from "nodemailer";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const WINDOW_MS=10*60*1000;
const MAX_REQUESTS=5;
const requests=new Map<string,{count:number;resetAt:number}>();
const courses=new Set(["Video Editing","Content Creation","AI Video Creation","Career Test","General enquiry"]);
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(message:string,status:number){return NextResponse.json({message},{status,headers:{"Cache-Control":"no-store"}})}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char] as string))}
function rateLimited(ip:string){
 const now=Date.now();
 for(const [key,value] of requests){if(value.resetAt<=now)requests.delete(key)}
 const current=requests.get(ip);
 if(!current||current.resetAt<=now){requests.set(ip,{count:1,resetAt:now+WINDOW_MS});return false}
 current.count+=1;
 return current.count>MAX_REQUESTS;
}

export async function POST(request:NextRequest){
 try{
  const contentLength=Number(request.headers.get("content-length")||0);
  if(contentLength>12000)return json("Please shorten your enquiry and try again.",413);
  const body=await request.json();
  const name=typeof body.name==="string"?body.name.trim():"";
  const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
  const phone=typeof body.phone==="string"?body.phone.trim():"";
  const course=typeof body.course==="string"?body.course:"";
  const message=typeof body.message==="string"?body.message.trim():"";
  const honeypot=typeof body.website==="string"?body.website.trim():"";
  if(honeypot)return json("Thanks, your enquiry has been sent.",200);
  const ip=(request.headers.get("x-real-ip")||request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()||"unknown").slice(0,100);
  if(rateLimited(ip))return json("Too many submissions. Please wait a few minutes and try again.",429);
  if(name.length<2||name.length>100||!emailPattern.test(email)||email.length>254||!courses.has(course)||message.length<5||message.length>3000||phone.length>30){
   return json("Please check your details and try again. The message must be between 5 and 3,000 characters.",400);
  }
  const host=process.env.SMTP_HOST;
  const user=process.env.SMTP_USER;
  const pass=process.env.SMTP_PASS;
  const to=process.env.CONTACT_TO_EMAIL;
  const from=process.env.SMTP_FROM_EMAIL||user;
  const port=Number(process.env.SMTP_PORT||465);
  if(!host||!user||!pass||!to||!from)return json("We couldn't send your enquiry right now. Please try again or email us directly.",503);
  const transporter=nodemailer.createTransport({host,port,secure:process.env.SMTP_SECURE?process.env.SMTP_SECURE==="true":port===465,auth:{user,pass}});
  const safeName=escapeHtml(name),safeEmail=escapeHtml(email),safePhone=escapeHtml(phone||"Not provided"),safeCourse=escapeHtml(course),safeMessage=escapeHtml(message).replace(/\r?\n/g,"<br>");
  await transporter.sendMail({
   from,to,
   replyTo:email,
   subject:"New course enquiry from "+name.replace(/[\r\n]/g," ").slice(0,100),
   text:"New Growmorex enquiry\n\nName: "+name+"\nEmail: "+email+"\nPhone: "+(phone||"Not provided")+"\nCourse: "+course+"\n\nMessage:\n"+message,
   html:`<h2>New Growmorex enquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Course:</strong> ${safeCourse}</p><p><strong>Message:</strong><br>${safeMessage}</p>`
  });
  return json("Thanks, your enquiry has been sent. We'll get back to you soon.",200);
 }catch(error){
  console.error("Contact form submission failed:",error);
  return json("We couldn't send your enquiry right now. Please try again or email us directly.",500);
 }
}

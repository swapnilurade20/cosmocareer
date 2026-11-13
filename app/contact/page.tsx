"use client";
import {FormEvent,useState} from "react";

const field:React.CSSProperties={display:"block",width:"100%",padding:12,margin:"7px 0 18px",border:"1px solid #d0d5dd",borderRadius:10,background:"white",color:"#172033"};
const options=["Video Editing","Content Creation","AI Video Creation","Career Test","General enquiry"];

export default function ContactPage(){
 const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
 const [notice,setNotice]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(status==="sending")return;
  const form=event.currentTarget;
  const data=new FormData(form);
  const payload={name:String(data.get("name")||""),email:String(data.get("email")||""),phone:String(data.get("phone")||""),course:String(data.get("course")||""),message:String(data.get("message")||""),website:String(data.get("website")||"")};
  setStatus("sending");setNotice("");
  try{
   const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const result=await response.json();
   if(!response.ok)throw new Error(typeof result.message==="string"?result.message:"We couldn't send your enquiry right now. Please try again or email us directly.");
   setStatus("success");setNotice("Thanks, your enquiry has been sent. We’ll get back to you soon.");form.reset();
  }catch(error){
   setStatus("error");setNotice(error instanceof Error?error.message:"We couldn't send your enquiry right now. Please try again or email us directly.");
  }
 }
 return <main className="section"><div className="container" style={{maxWidth:820}}><span className="tag">CONTACT GROWMOREX</span><h1 style={{fontSize:40}}>We are happy to help.</h1><p className="muted">Ask us about a course, the career test or anything else. Send your enquiry here and our team will get back to you.</p>
 <form className="card" onSubmit={submit}>
  <label>Name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name" style={field}/></label>
  <label>Email address<input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" style={field}/></label>
  <label>Phone number <span className="muted">(optional)</span><input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+91..." style={field}/></label>
  <label>Course of interest<select name="course" required defaultValue="" style={field}><option value="" disabled>Select an option</option>{options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>
  <label>Message<textarea name="message" required minLength={5} maxLength={3000} rows={5} placeholder="Tell us how we can help (maximum 3,000 characters)." style={field}/></label>
  <div aria-hidden="true" style={{position:"absolute",left:"-10000px",width:1,height:1,overflow:"hidden"}}><label>Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off"/></label></div>
  <button className="btn primary" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending…":"Send enquiry"}</button>
  {notice&&<p role="status" aria-live="polite" style={{marginTop:16,color:status==="success"?"#16834a":"#b42318"}}>{notice}</p>}
 </form>
 <section className="card" style={{marginTop:20}}><h2>Need to email us directly?</h2><p><a href="mailto:hello@growmorex.in">hello@growmorex.in</a></p></section>
 </div></main>;
}

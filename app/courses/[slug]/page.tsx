"use client";

import {courseGuides} from "@/app/course-guides";
import {useEffect,useRef,useState} from "react";
import {useParams,useRouter} from "next/navigation";

type Lesson={_id:string;title:string;description:string;videoUrl:string;durationMinutes:number;isPreview:boolean;isCompleted?:boolean};
type Module={_id:string;title:string;description:string;lessons:Lesson[]};
type Course={_id:string;title:string;slug:string;shortDescription:string;description:string;category:string;level:string;durationWeeks:number;price:number;language:string};

const flagship=["video-editing","content-creator","ai-video-creation"];
const stages=[
 {n:"01",time:"Days 1–15",title:"Build your core skill",desc:"Learn the essential tools, techniques and workflows through guided lessons and practical exercises."},
 {n:"02",time:"Days 16–25",title:"Develop career skills",desc:"Practise communication, presentations, workplace culture and work-life planning."},
 {n:"03",time:"Day 26",title:"Create your portfolio",desc:"Prepare your resume and organise your strongest work into a professional portfolio."},
 {n:"04",time:"Days 27–30",title:"Complete your assessment",desc:"Finish pending projects, submit your capstone and work towards the published certificate requirements."},
 {n:"05",time:"Days 31–40",title:"Practise for interviews",desc:"Take mock interviews, receive feedback and prepare a practical action plan for your next step."}
];

async function readApiResponse(response:Response){
 const raw=await response.text();
 if(!raw.trim())throw new Error(response.ok?"The course service returned an empty response. Please try again.":"The course service is temporarily unavailable. Please try again.");
 let data:any;
 try{data=JSON.parse(raw)}catch{throw new Error("The course service returned an invalid response. Please refresh and try again.")}
 if(!response.ok)throw new Error(data?.error||"Unable to load this course.");
 return data;
}

export default function CourseLearningPage(){
 const params=useParams<{slug:string}>();
 const router=useRouter();
 const slug=params.slug;
 const guide=courseGuides[slug];
 const isFlagship=flagship.includes(slug);
 const [course,setCourse]=useState<Course|null>(null);
 const [modules,setModules]=useState<Module[]>([]);
 const [enrolled,setEnrolled]=useState(false);
 const [selected,setSelected]=useState<Lesson|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [checkoutBusy,setCheckoutBusy]=useState(false);
 const [expandedFaq,setExpandedFaq]=useState<number|null>(0);
 const lastSaved=useRef(0);

 async function load(){
  setLoading(true);setError("");
  try{
   const r=await fetch("/api/learning/courses/"+encodeURIComponent(slug),{cache:"no-store",headers:{Accept:"application/json"}});
   const d=await readApiResponse(r);
   setCourse(d.course||null);setModules(Array.isArray(d.modules)?d.modules:[]);setEnrolled(Boolean(d.enrolled));
   const first=(Array.isArray(d.modules)?d.modules:[]).flatMap((m:Module)=>m.lessons||[])[0];
   setSelected((old:Lesson|null)=>old||first||null);
  }catch(e){setError(e instanceof Error?e.message:"Unable to load course")}
  finally{setLoading(false)}
 }

 useEffect(()=>{let active=true;setLoading(true);setError("");setSelected(null);
  (async()=>{try{
   const r=await fetch("/api/learning/courses/"+encodeURIComponent(slug),{cache:"no-store",headers:{Accept:"application/json"}});
   const d=await readApiResponse(r);
   if(!active)return;
   setCourse(d.course||null);setModules(Array.isArray(d.modules)?d.modules:[]);setEnrolled(Boolean(d.enrolled));
   const first=(Array.isArray(d.modules)?d.modules:[]).flatMap((m:Module)=>m.lessons||[])[0];
   setSelected(first||null);
  }catch(e){if(active)setError(e instanceof Error?e.message:"Unable to load course")}
  finally{if(active)setLoading(false)}})();
  return()=>{active=false};
 },[slug]);

 async function startCheckout(){
  if(!course||checkoutBusy)return;
  setCheckoutBusy(true);setError("");
  try{
   if(!(window as any).Razorpay){
    await new Promise<void>((resolve,reject)=>{
     const existing=document.querySelector('script[data-razorpay-checkout]');
     if(existing){existing.addEventListener("load",()=>resolve(),{once:true});existing.addEventListener("error",()=>reject(new Error("Unable to load secure payment checkout.")),{once:true});return;}
     const script=document.createElement("script");script.src="https://checkout.razorpay.com/v1/checkout.js";script.async=true;script.dataset.razorpayCheckout="true";script.onload=()=>resolve();script.onerror=()=>reject(new Error("Unable to load secure payment checkout."));document.body.appendChild(script);
    });
   }
   const orderResponse=await fetch("/api/payments/course-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({courseId:course._id})});
   const order=await orderResponse.json();if(orderResponse.status===401){router.push("/login");return;}if(!orderResponse.ok)throw new Error(order.error||"Unable to start payment.");
   const Razorpay=(window as any).Razorpay;
   if(!Razorpay)throw new Error("Secure payment checkout did not load. Please refresh and try again.");
   const checkout=new Razorpay({key:order.keyId,amount:order.amount,currency:order.currency,name:"CosmoCareer",description:order.courseName,order_id:order.orderId,theme:{color:"#625ce7"},handler:async(response:any)=>{
    try{
     const verify=await fetch("/api/payments/course-verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(response)});
     const result=await verify.json();if(!verify.ok)throw new Error(result.error||"Payment verification is pending.");
     setEnrolled(true);setError("");await load();
    }catch(e){setError(e instanceof Error?e.message:"Payment confirmation is pending. Contact support before paying again.");}
   },modal:{ondismiss:()=>setCheckoutBusy(false)}});
   checkout.on("payment.failed",(response:any)=>setError(response?.error?.description||"Payment failed. Please try again."));
   checkout.open();
  }catch(e){setError(e instanceof Error?e.message:"Unable to open checkout.");}
  finally{setCheckoutBusy(false);}
 }
 async function enroll(){
  if(!course)return;
  const r=await fetch("/api/learning/enrollments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({courseId:course._id})});
  const d=await r.json();
  if(r.status===401){router.push("/login");return}
  if(!r.ok){setError(d.error||"Enrolment failed");return}
  await load();
 }
 async function saveProgress(seconds:number,duration:number){
  if(!enrolled||!course||!selected)return;
  const now=Date.now();if(now-lastSaved.current<10000&&seconds<duration)return;
  lastSaved.current=now;
  await fetch("/api/learning/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({courseId:course._id,moduleId:modules.find(m=>m.lessons.some(l=>l._id===selected._id))?._id,lessonId:selected._id,watchedSeconds:seconds,durationSeconds:duration})});
 }

 if(!isFlagship||!guide)return <main className="course-detail-page"><div className="container course-detail-shell"><section className="course-not-found"><span className="course-kicker">COSMOCAREER COURSES</span><h1>Course not available</h1><p>This course is not part of our current catalogue. Explore our three practical learning programmes.</p><a className="btn primary" href="/courses">Explore courses <span>→</span></a></section></div></main>;

 const title=course?.title||guide.title;
 const faqItems=[
  ["How long does the programme take?","The guided programme is 30 days, followed by 10 days of mock interview practice. Batch dates and schedules are shared before enrolment."],
  ["Will I get lifetime access?","Lifetime access applies to recorded lessons, notes, projects and certificates issued to you. Live classes, teacher reviews and mock interviews are available during the active batch."],
  ["Does the course guarantee a job?","No. The programme provides practical learning and placement preparation support, but a job, salary or freelance project is not guaranteed. Hiring decisions depend on employers and your performance."],
  ["Can I pay in instalments?","An EMI option may be offered at checkout depending on payment-provider eligibility and availability. Please contact the team for current payment options."],
  ["When will I receive my certificate?","Certificate eligibility depends on completing the published learning, assessment and project requirements. Registration alone does not qualify you for a certificate."]
 ];

 return <main className="course-detail-page">
  <section className="course-detail-hero"><div className="container course-detail-hero-grid">
   <div className="course-detail-copy"><a className="course-back-link" href="/courses">← All courses</a><span className="course-kicker">COSMOCAREER FLAGSHIP PROGRAMME</span><div className="course-hero-badges"><span>Practical learning</span><span>Hindi & English support</span><span>Portfolio focused</span></div>
    <h1>{title}</h1><p className="course-hero-promise" style={{fontSize:"clamp(20px,2vw,25px)",lineHeight:1.7}}>{guide.promise}</p><p className="course-hero-who" style={{fontSize:"18px",lineHeight:1.85}}>{guide.who}</p>
    <div className="course-hero-actions"><button className="btn primary" type="button" onClick={startCheckout} disabled={!course||checkoutBusy}>{checkoutBusy?"Opening secure checkout…":"Enrol now · ₹30,000"}</button><a className="course-demo-link" href={"/contact?topic="+encodeURIComponent(title+" enrolment")}>Ask a question</a><a className="course-demo-link" href="/contact?topic=free-demo">Request a course demo</a></div>
    <div className="course-trust-points"><span>✓ Guided practice</span><span>✓ Resume & portfolio</span><span>✓ Interview preparation</span></div>
   </div>
   <div className="course-hero-visual"><div className="course-visual-orbit"/><img src={"/course-art/"+slug+".svg"} alt={title+" course illustration"} fetchPriority="high"/><div className="course-visual-note"><span>40</span><div><b>Day learning journey</b><small>30 days course + 10 days practice</small></div></div></div>
  </div></section>

  <section className="course-price-strip"><div className="container course-price-inner"><div><span className="course-kicker">PROGRAMME INVESTMENT</span><div className="course-price">₹30,000 <small>one-time fee</small></div><p>Lifetime access to recorded course materials</p></div><div className="course-price-facts"><span><b>30 days</b><small>Guided course</small></span><span><b>10 days</b><small>Mock interviews</small></span><span><b>Lifetime</b><small>Recorded access</small></span></div><button className="btn primary" type="button" onClick={startCheckout} disabled={!course||checkoutBusy}>{checkoutBusy?"Opening checkout…":"Enrol now · ₹30,000"}</button></div></section>

  <section className="section course-outcomes-section"><div className="container"><div className="course-section-heading"><span className="course-kicker">WHAT YOU WILL GET</span><h2>Learn by doing. Finish with work to show.</h2><p style={{fontSize:"18px",lineHeight:1.9}}>Build practical ability through guided lessons, projects and career preparation—not just passive video watching.</p></div>
   <div className="course-outcome-grid"><article><span className="course-outcome-icon">✦</span><h3>Practical subject skills</h3><p>Learn the core techniques and workflows used in your chosen creative field.</p></article><article><span className="course-outcome-icon peach">▤</span><h3>Portfolio projects</h3><p>Practise through assignments and develop work you can present to potential clients or employers.</p></article><article><span className="course-outcome-icon mint">◎</span><h3>Career readiness</h3><p>Work on communication, presentation, resume preparation and interview confidence.</p></article><article><span className="course-outcome-icon blue">↗</span><h3>Next-step support</h3><p>Get placement preparation guidance and support exploring relevant opportunities.</p></article></div>
  </div></section>

  <section className="section course-skills-section"><div className="container course-skills-grid"><div><span className="course-kicker">YOUR LEARNING OUTCOMES</span><h2>Skills you can put into practice.</h2><p className="course-section-intro" style={{fontSize:"18px",lineHeight:1.9}}>{guide.promise} Use the programme to practise, build examples of your work and understand how your skills can translate into real projects.</p><div className="course-skill-list">{guide.learn.map((x,i)=><div key={x}><span>0{i+1}</span><b style={{fontSize:"18px"}}>{x}</b></div>)}</div></div><div className="course-project-panel"><span className="course-kicker">PRACTICE & PORTFOLIO</span><h3>Make your learning visible.</h3><p style={{fontSize:"17px",lineHeight:1.9}}>Work on guided exercises and practical projects, then organise your best work into a portfolio.</p><div className="course-project-list">{guide.projects.map((x,i)=><div key={x} style={{fontSize:"16px",lineHeight:1.8}}><span>↗</span>{x}</div>)}</div><div className="course-tool-note"><b>Tools to explore</b><p>{guide.tools.join(" · ")}</p></div></div></div></section>

  <section className="section course-journey-section"><div className="container"><div className="course-section-heading"><span className="course-kicker">THE 40-DAY JOURNEY</span><h2>A clear path from learning to preparation.</h2><p style={{fontSize:"18px",lineHeight:1.9}}>Five stages keep the programme focused and help you see what comes next.</p></div><div className="course-stage-grid">{stages.map(s=><article key={s.n}><span className="course-stage-number">{s.n}</span><small>{s.time}</small><h3>{s.title}</h3><p style={{fontSize:"16px",lineHeight:1.85}}>{s.desc}</p></article>)}</div></div></section>

  <section className="section course-roles-section"><div className="container course-roles-grid"><div><span className="course-kicker">WHERE CAN THIS TAKE YOU?</span><h2>Explore roles connected to your skills.</h2><p style={{fontSize:"17px",lineHeight:1.9}}>These are examples of possible directions. Actual requirements vary by employer, experience and location.</p><div className="course-role-pills">{guide.roles.map(r=><span key={r} style={{fontSize:"15px",padding:"10px 14px"}}>{r}</span>)}</div><a className="course-inline-link" href="/career-guide">Explore the career guide →</a></div><div className="course-roles-art"><div className="roles-art-card"><span>YOUR NEXT CHAPTER</span><b>Skills → Projects → Opportunities</b><i>Keep learning. Keep creating.</i></div><span className="roles-art-spark">✦</span><span className="roles-art-dot"/></div></div></section>

  <section className="section course-live-section"><div className="container"><div className="course-section-heading"><span className="course-kicker">YOUR LEARNING SPACE</span><h2>{enrolled?"Continue your course":"Preview the learning experience"}</h2><p style={{fontSize:"18px",lineHeight:1.9}}>{enrolled?"Choose a lesson and continue building your skills.":"Explore available lesson previews. Enrolled learners can access their course lessons here."}</p></div>
   {loading?<div className="course-loading-panel"><span/><span/><span/></div>:<>{error&&<div className="course-error-panel" role="status"><span>{error}</span><button className="btn" onClick={load}>Retry lessons</button></div>}<div className="course-learning-grid"><section className="card lesson-player-panel"><div className="course-player-label"><span>{enrolled?"YOUR LESSON":"LESSON PREVIEW"}</span>{selected&&<small>{selected.durationMinutes||0} min</small>}</div><h3>{selected?.title||"Course lessons"}</h3>{selected?.videoUrl&&(enrolled||selected.isPreview)?<video key={selected._id} controls playsInline preload="none" poster={"/course-art/"+slug+".svg"} src={selected.videoUrl} onTimeUpdate={e=>{const v=e.currentTarget;if(v.currentTime-lastSaved.current/1000>10)saveProgress(v.currentTime,v.duration||selected.durationMinutes*60)}}/>:<div className="course-video-placeholder"><img src={"/course-art/"+slug+".svg"} alt="" loading="lazy"/><div><b>{selected?.title||"Your lessons will appear here"}</b><p>{selected?.description||"The lesson list will appear here when published."}</p>{!enrolled&&<span>Enquire to learn about enrolment and access.</span>}</div></div>}{!enrolled&&<button className="btn primary" type="button" onClick={startCheckout} disabled={!course||checkoutBusy}>{checkoutBusy?"Opening checkout…":"Enrol now · ₹30,000"}</button>}</section><aside className="card course-content-panel"><div className="course-content-heading"><h3>Course content</h3><span>{modules.reduce((n,m)=>n+m.lessons.length,0)} lessons</span></div>{modules.length===0?<p className="muted" style={{fontSize:"16px",lineHeight:1.8}}>Course lessons will be published for your batch. Contact our team for the latest schedule.</p>:modules.map((m,i)=><div className="course-module" key={m._id}><b style={{fontSize:"17px",lineHeight:1.6}}>{i+1}. {m.title}</b>{m.lessons.map(l=><button key={l._id} onClick={()=>{setSelected(l);lastSaved.current=0}} className={selected?._id===l._id?"active":""}><span>{l.isCompleted?"✓":l.isPreview?"▶":"▣"}</span><span style={{fontSize:"15px",lineHeight:1.6}}>{l.title}</span>{l.isPreview&&<small>Preview</small>}</button>)}</div>)}</aside></div></>}
  </div></section>

  <section className="section course-faq-section"><div className="container course-faq-grid"><div><span className="course-kicker">GOOD TO KNOW</span><h2>Questions before you begin?</h2><p style={{fontSize:"17px",lineHeight:1.9}}>Review the essentials, or contact our team if you need help choosing a programme.</p><a className="btn primary" href="/contact?topic=course-enquiry">Ask a question <span>↗</span></a></div><div className="course-faq-list">{faqItems.map((item,i)=><details key={item[0]} open={expandedFaq===i} onToggle={e=>{if(e.currentTarget.open)setExpandedFaq(i)}}><summary>{item[0]}<span>{expandedFaq===i?"−":"+"}</span></summary><p style={{fontSize:"16px",lineHeight:1.9}}>{item[1]}</p></details>)}</div></div></section>

  <section className="course-placement-band"><div className="container"><div><span className="course-kicker">AFTER THE COURSE</span><h2>Keep moving towards your career goals.</h2><p style={{fontSize:"17px",lineHeight:1.9}}>Get support with resume improvements, portfolio presentation, career counselling and tips for finding freelance opportunities. Support duration and availability are confirmed for each batch.</p><small>Placement support helps you prepare; it does not guarantee a job, salary or freelance work.</small></div><a className="btn course-placement-btn" href="/placement-support">Explore placement support <span>→</span></a></div></section>
 </main>;
}

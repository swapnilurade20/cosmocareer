"use client";

import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";

type Account={name:string;email:string;role:string;preferredLanguage:string};
type Course={_id:string;title:string;slug:string;shortDescription:string;category:string;level:string;durationWeeks:number;language:string;price:number};
type Enrollment={_id:string;courseId:Course;enrolledAt?:string};
type Progress={_id:string;completed:number;lessonsStarted:number};
type Certificate={certificateNumber:string;issuedAt:string;status:string;course?:{title:string};verificationUrl:string};
type Notice={_id:string;title?:string;message?:string;body?:string;createdAt?:string;readAt?:string};

export default function Dashboard(){
 const [user,setUser]=useState<Account|null>(null);
 const [enrollments,setEnrollments]=useState<Enrollment[]>([]);
 const [progress,setProgress]=useState<Progress[]>([]);
 const [certificates,setCertificates]=useState<Certificate[]>([]);
 const [notices,setNotices]=useState<Notice[]>([]);
 const [unread,setUnread]=useState(0);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const router=useRouter();

 useEffect(()=>{let active=true;(async()=>{try{
  const me=await fetch("/api/auth/me",{cache:"no-store"});
  if(!me.ok){router.replace("/login");return}
  const md=await me.json();if(!active)return;setUser(md.user);
  if(md.user.role==="student"){
   const [er,cr,nr]=await Promise.all([
    fetch("/api/learning/enrollments",{cache:"no-store"}),
    fetch("/api/learning/certificates",{cache:"no-store"}),
    fetch("/api/notifications",{cache:"no-store"})
   ]);
   const [ed,cd,nd]=await Promise.all([er.json(),cr.json(),nr.json()]);
   if(!er.ok)throw new Error(ed.error||"Could not load your courses.");
   if(active){setEnrollments(ed.enrollments||[]);setProgress(ed.progress||[]);if(cr.ok)setCertificates(cd.certificates||[]);if(nr.ok){setNotices(nd.notifications||[]);setUnread(nd.unread||0)}}
  }
 }catch(e){if(active)setError(e instanceof Error?e.message:"Unable to load your dashboard.")}finally{if(active)setLoading(false)}})();return()=>{active=false}},[router]);

 const completed=useMemo(()=>progress.reduce((n,p)=>n+p.completed,0),[progress]);
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh()}
 async function markRead(){const r=await fetch("/api/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({markAllRead:true})});if(r.ok){setUnread(0);setNotices(v=>v.map(n=>({...n,readAt:new Date().toISOString()})))}}

 if(loading)return <main className="student-dashboard"><div className="container dashboard-shell"><div className="dashboard-skeleton"><span/><span/><span/></div></div></main>;
 if(!user)return <main className="student-dashboard"><div className="container dashboard-shell"><section className="dashboard-empty"><span className="dashboard-kicker">COSMOCAREER</span><h1>Sign in to continue</h1><p>{error||"Please sign in to access your account and learning activity."}</p><a className="btn primary" href="/login">Sign in</a></section></div></main>;

 if(user.role!=="student"){
  const destination=user.role==="admin"?"/admin":user.role==="employer"?"/employer":user.role==="teacher"?"/teacher":user.role==="counsellor"?"/counsellor":"/employee";
  const roleLabel=user.role==="admin"?"Administrator":user.role==="employer"?"Employer":"Team account";
  return <main className="student-dashboard"><div className="container dashboard-shell"><section className="dashboard-welcome"><div><span className="dashboard-kicker">{roleLabel}</span><h1>Welcome, {user.name}</h1><p>Your CosmoCareer workspace is ready.</p></div><button className="btn dashboard-logout" onClick={logout}>Sign out</button></section><section className="dashboard-empty"><div className="dashboard-feature-icon">✦</div><h2>Continue to your workspace</h2><p>Open your role-specific tools and manage your work from one place.</p><a className="btn primary" href={destination}>Open {user.role} workspace <span>→</span></a></section></div></main>;
 }

 return <main className="student-dashboard"><div className="container dashboard-shell">
  <section className="dashboard-welcome">
   <div><span className="dashboard-kicker">YOUR LEARNING SPACE</span><h1>Welcome back, {user.name.split(" ")[0]} <span>✦</span></h1><p>Keep building your skills. Your next step starts here.</p></div>
   <div className="dashboard-welcome-actions"><a className="btn dashboard-light-btn" href="/courses">Explore courses <span>↗</span></a><button className="btn dashboard-logout" onClick={logout}>Sign out</button></div>
   <div className="dashboard-decoration dashboard-decoration-one"/><div className="dashboard-decoration dashboard-decoration-two"/>
  </section>
  {error&&<div className="dashboard-error" role="alert">{error}</div>}
  <section className="dashboard-stat-grid">
   <article className="dashboard-stat"><span className="dashboard-stat-icon lavender-stat">▣</span><div><small>Active courses</small><strong>{enrollments.length}</strong></div></article>
   <article className="dashboard-stat"><span className="dashboard-stat-icon peach-stat">✓</span><div><small>Lessons completed</small><strong>{completed}</strong></div></article>
   <article className="dashboard-stat"><span className="dashboard-stat-icon mint-stat">✧</span><div><small>Certificates earned</small><strong>{certificates.length}</strong></div></article>
   <article className="dashboard-stat"><span className="dashboard-stat-icon blue-stat">♧</span><div><small>Unread updates</small><strong>{unread}</strong></div></article>
  </section>

  <section className="dashboard-section">
   <div className="dashboard-section-heading"><div><span className="dashboard-kicker">PICK UP WHERE YOU LEFT OFF</span><h2>My learning</h2><p>Your courses and learning activity.</p></div><a className="dashboard-text-link" href="/courses">Browse all courses <span>→</span></a></div>
   {enrollments.length===0?<article className="dashboard-empty"><div className="dashboard-feature-icon">✦</div><h3>Your learning journey starts here.</h3><p>Explore practical programmes in video editing, content creation and AI video creation. Paid enrolment will open after secure checkout is connected.</p><a className="btn primary" href="/courses">Explore courses <span>→</span></a></article>:<div className="dashboard-course-grid">{enrollments.filter(e=>e.courseId).map(e=>{const p=progress.find(x=>x._id===e.courseId._id);return <article className="dashboard-course-card" key={e._id}><div className="dashboard-course-art"><span>{e.courseId.category||"COURSE"}</span><img src={"/course-art/"+e.courseId.slug+".svg"} alt="" loading="lazy" onError={ev=>{ev.currentTarget.style.display="none"}}/></div><div className="dashboard-course-body"><div className="dashboard-course-meta"><span>{e.courseId.level||"Learning path"}</span><span>{e.courseId.durationWeeks?e.courseId.durationWeeks+" weeks":"Self-paced"}</span></div><h3>{e.courseId.title}</h3><p>{e.courseId.shortDescription}</p><div className="dashboard-activity"><span>Lesson activity</span><b>{p?.completed||0} completed</b></div><div className="dashboard-activity-bar"><span style={{width:(p&&p.lessonsStarted?Math.min(100,Math.round(p.completed/p.lessonsStarted*100)):0)+"%"}}/></div><small className="dashboard-activity-note">{p?.lessonsStarted||0} lessons started · Progress updates as you complete lessons.</small><a className="btn primary dashboard-course-button" href={"/learning/programme?courseId="+e.courseId._id}>Continue learning <span>→</span></a></div></article>})}</div>}
  </section>

  <section className="dashboard-section"><div className="dashboard-section-heading"><div><span className="dashboard-kicker">YOUR NEXT STEP</span><h2>Grow beyond the classroom</h2><p>Tools and guidance to help you move forward.</p></div></div>
   <div className="dashboard-tools-grid">
    <a className="dashboard-tool-card" href="/career-test"><span className="tool-icon lavender-stat">⌕</span><div><h3>Career discovery</h3><p>Explore career directions and understand your strengths.</p><b>Take career test →</b></div></a>
    <a className="dashboard-tool-card" href="/placement-support"><span className="tool-icon peach-stat">↗</span><div><h3>Placement preparation</h3><p>Prepare your resume, practise interviews and explore opportunities.</p><b>View support →</b></div></a>
    <a className="dashboard-tool-card" href="/career-guide"><span className="tool-icon mint-stat">◎</span><div><h3>Career guide</h3><p>Explore roles, skills and practical next steps.</p><b>Explore guide →</b></div></a>
   </div>
  </section>

  <section className="dashboard-bottom-grid">
   <article className="dashboard-panel"><div className="dashboard-panel-heading"><div><span className="dashboard-kicker">ACHIEVEMENTS</span><h2>My certificates</h2></div><span className="dashboard-panel-icon">✧</span></div><p>{certificates.length?certificates.length+" certificate(s) issued to your account.":"Your verified certificates will appear here after course completion and approval."}</p>{certificates.slice(0,3).map(c=><div className="dashboard-certificate" key={c.certificateNumber}><span>✦</span><div><b>{c.course?.title||c.certificateNumber}</b><small>{c.status} · {new Date(c.issuedAt).toLocaleDateString("en-IN")}</small></div><a href={c.verificationUrl} target="_blank" rel="noreferrer">Verify ↗</a></div>)}<a className="dashboard-text-link" href="/learning/programme">View learning programme →</a></article>
   <article className="dashboard-panel"><div className="dashboard-panel-heading"><div><span className="dashboard-kicker">LATEST UPDATES</span><h2>Notifications {unread>0&&<span className="dashboard-unread">{unread}</span>}</h2></div><span className="dashboard-panel-icon">♧</span></div>{notices.slice(0,3).map(n=><div className="dashboard-notice" key={n._id}><span className={n.readAt?"notice-dot read":"notice-dot"}/><div><b>{n.title||"Account update"}</b><p>{n.message||n.body||"You have a new account update."}</p></div></div>)}{notices.length===0&&<p>You are all caught up. New account updates will appear here.</p>}{unread>0&&<button className="dashboard-text-button" onClick={markRead}>Mark all as read</button>}<a className="dashboard-text-link" href="/notifications">View all notifications →</a></article>
  </section>
  <section className="dashboard-help"><div><span className="dashboard-kicker">WE'RE HERE TO HELP</span><h2>Need a hand with your next step?</h2><p>Talk to our team about courses, career guidance or creative services.</p></div><a className="btn dashboard-light-btn" href="/contact">Contact support <span>↗</span></a></section>
  <p className="dashboard-disclaimer">Placement support helps you prepare and explore opportunities; it does not guarantee a job, salary or freelance work.</p>
 </div></main>;
}

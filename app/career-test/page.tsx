"use client";

import { useMemo, useState } from "react";

type TypeCode = "R" | "I" | "A" | "S" | "E" | "C";
type Item = { text: string; type: TypeCode };
type Profile = { name: string; title: string; description: string; careers: string[]; pathways: string[]; course: string };

const profiles: Record<TypeCode, Profile> = {
 R: { name: "Realistic", title: "The Practical Builder", description: "You may enjoy practical, hands-on work involving tools, equipment, technology, making, repairing or working outdoors.", careers: ["Electrical / Electronics Technician", "Mechanical or Civil Technician", "Field Service Associate", "Video Production Technician", "Network Support Technician"], pathways: ["Diploma or ITI routes in relevant technical trades", "Engineering or applied technology degrees", "Hands-on projects, apprenticeships and safety training"], course: "Video Editing" },
 I: { name: "Investigative", title: "The Curious Problem-Solver", description: "You may enjoy understanding how things work, analysing evidence, researching questions and solving complex problems.", careers: ["Data Analyst", "Business Analyst", "Research Assistant", "Quality Analyst", "Cybersecurity Analyst"], pathways: ["Mathematics, science or commerce foundations as relevant", "Data, programming or research-method courses", "Build a portfolio of analysis projects"], course: "AI Video Creation" },
 A: { name: "Artistic", title: "The Creative Maker", description: "You may enjoy expressing ideas through design, media, storytelling, performance and original creative work.", careers: ["Video Editor", "Content Creator", "Graphic / Motion Designer", "UX/UI Designer", "Copywriter or Scriptwriter"], pathways: ["Design, media, communication or fine-arts education", "A portfolio of original work", "Practice with professional creative tools"], course: "Video Editing" },
 S: { name: "Social", title: "The People Developer", description: "You may enjoy teaching, coaching, supporting, listening to and helping people learn or improve.", careers: ["Teacher / Trainer (with required qualifications)", "Learning and Development Associate", "Customer Success Associate", "Community Programme Coordinator", "HR / People Operations Associate"], pathways: ["Education, psychology, social work or HR routes", "Recognised qualifications for regulated roles", "Practice communication, facilitation and mentoring"], course: "Content Creation" },
 E: { name: "Enterprising", title: "The Initiator", description: "You may enjoy persuading, leading, negotiating, organising initiatives and turning ideas into business results.", careers: ["Business Development Associate", "Sales Executive", "Marketing Executive", "Startup Founder", "Product or Project Coordinator"], pathways: ["Business, commerce, management or marketing education", "Sales, communication and project experience", "Test a small business idea and measure demand"], course: "Content Creation" },
 C: { name: "Conventional", title: "The Organised Planner", description: "You may enjoy structured work with information, records, processes, numbers, accuracy and clear procedures.", careers: ["Accounts / Finance Assistant", "Operations Coordinator", "MIS Executive", "Banking Operations Associate", "Compliance / Documentation Assistant"], pathways: ["Commerce, accounting, administration or data routes", "Excel, accounting and documentation skills", "Practice accuracy with real-world case exercises"], course: "AI Video Creation" }
};

const items: Item[] = [
 {type:"R",text:"Assembling, repairing or maintaining equipment and devices."},
 {type:"R",text:"Creating or setting up physical things with my hands."},
 {type:"R",text:"Working with cameras, lighting, sound or production equipment."},
 {type:"R",text:"Learning how machines, networks or technical systems operate."},
 {type:"R",text:"Doing practical tasks where I can see a tangible result."},
 {type:"R",text:"Working outdoors, on-site or in an active environment."},
 {type:"I",text:"Investigating why something happened and finding the evidence."},
 {type:"I",text:"Working with data, numbers, patterns or research findings."},
 {type:"I",text:"Solving difficult problems that need careful reasoning."},
 {type:"I",text:"Learning scientific, technical or analytical concepts in depth."},
 {type:"I",text:"Testing an idea to find out whether it actually works."},
 {type:"I",text:"Comparing information from different sources before deciding."},
 {type:"A",text:"Creating videos, photographs, graphics or visual stories."},
 {type:"A",text:"Writing stories, scripts, articles or original ideas."},
 {type:"A",text:"Designing something that is both useful and attractive."},
 {type:"A",text:"Experimenting with music, performance or other creative forms."},
 {type:"A",text:"Finding new ways to communicate an idea or message."},
 {type:"A",text:"Working on projects where originality and imagination matter."},
 {type:"S",text:"Teaching someone a skill or explaining a difficult idea."},
 {type:"S",text:"Listening carefully and helping someone work through a problem."},
 {type:"S",text:"Supporting a team so that everyone can do their best."},
 {type:"S",text:"Planning learning, wellbeing or community activities."},
 {type:"S",text:"Building positive relationships with people from different backgrounds."},
 {type:"S",text:"Helping people gain confidence, knowledge or independence."},
 {type:"E",text:"Persuading others to consider an idea, product or service."},
 {type:"E",text:"Taking the lead and making decisions for a project."},
 {type:"E",text:"Negotiating, networking or building professional relationships."},
 {type:"E",text:"Starting a project or business and finding customers for it."},
 {type:"E",text:"Setting ambitious goals and motivating others to achieve them."},
 {type:"E",text:"Presenting proposals and taking responsibility for outcomes."},
 {type:"C",text:"Organising records, files, schedules or important information."},
 {type:"C",text:"Checking details carefully and correcting errors."},
 {type:"C",text:"Working with budgets, accounts, spreadsheets or reports."},
 {type:"C",text:"Following a clear process to complete work accurately."},
 {type:"C",text:"Maintaining databases or keeping information up to date."},
 {type:"C",text:"Planning tasks and tracking deadlines systematically."}
];

const scale = [
 {value:1,label:"Strongly dislike"},
 {value:2,label:"Dislike"},
 {value:3,label:"Not sure"},
 {value:4,label:"Like"},
 {value:5,label:"Strongly like"}
];
const typeOrder: TypeCode[] = ["R","I","A","S","E","C"];

export default function CareerTestPage() {
 const [answers,setAnswers] = useState<number[]>(Array(items.length).fill(0));
 const [page,setPage] = useState(0);
 const [finished,setFinished] = useState(false);
 const pageSize=6, pageCount=Math.ceil(items.length/pageSize), start=page*pageSize;
 const current=items.slice(start,start+pageSize);
 const complete=current.every((_,i)=>answers[start+i]>0);
 const answered=answers.filter(Boolean).length;
 const results=useMemo(()=>typeOrder.map(type=>{
   const indexes=items.map((item,index)=>item.type===type?index:-1).filter(index=>index>=0);
   const total=indexes.reduce((sum,index)=>sum+answers[index],0);
   return {type,...profiles[type],total,max:indexes.length*5,score:Math.round(total/(indexes.length*5)*100)};
 }).sort((a,b)=>b.score-a.score),[answers]);
 const code=results.slice(0,3).map(result=>result.type).join("");
 const choose=(index:number,value:number)=>setAnswers(old=>old.map((answer,i)=>i===index?value:answer));
 const restart=()=>{setAnswers(Array(items.length).fill(0));setPage(0);setFinished(false);window.scrollTo({top:0,behavior:"smooth"});};
 return <main>
  <section className="hero"><div className="container">
   <span className="tag">COSMOCAREER • CAREER DISCOVERY</span>
   <h1>Find career directions that fit your interests.</h1>
   <p>Explore the kinds of activities you enjoy, discover your interest profile and get practical career pathways to investigate.</p>
   <p style={{fontSize:14,color:"#c7d2fe"}}>36 statements · About 8–12 minutes · No right or wrong answers</p>
  </div></section>
  <section className="section"><div className="container" style={{maxWidth:900}}>
  {!finished ? <div className="card">
   <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><span className="tag">CAREER INTEREST INVENTORY</span><b>Section {page+1} of {pageCount}</b></div>
   <div style={{height:9,background:"#e9eaf5",borderRadius:20,margin:"18px 0 20px",overflow:"hidden"}}><div style={{width:(answered/items.length*100)+"%",height:"100%",background:"#7774f5",borderRadius:20}}/></div>
   <p className="muted" style={{fontSize:14,marginBottom:18}}>Rate how much you would enjoy each activity. Answer based on your genuine interest, not whether you are already good at it.</p>
   <div style={{display:"grid",gap:14}}>
    {current.map((item,offset)=>{const index=start+offset;return <section key={index} style={{padding:"18px 20px",border:"1px solid #e7e8f0",borderRadius:16,background:"#fff"}}>
     <div style={{fontSize:13,fontWeight:800,color:"#7774f5",marginBottom:8}}>STATEMENT {index+1} OF {items.length}</div>
     <h2 style={{fontSize:18,lineHeight:1.45,margin:"0 0 14px",fontWeight:750}}>{item.text}</h2>
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
      {scale.map(option=><button key={option.value} type="button" onClick={()=>choose(index,option.value)} aria-pressed={answers[index]===option.value} style={{padding:"12px 9px",borderRadius:10,border:answers[index]===option.value?"2px solid #6965e8":"1px solid #e5e7eb",background:answers[index]===option.value?"#f0efff":"white",color:"#101828",fontSize:13,fontWeight:650,cursor:"pointer"}}>{option.label}</button>)}
     </div>
    </section>})}
   </div>
   <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:24,flexWrap:"wrap"}}>
    <button type="button" className="btn" style={{background:"#f1f2f6",color:"#344054"}} disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>Previous</button>
    <button type="button" className="btn primary" disabled={!complete} onClick={()=>{if(!complete)return;if(page===pageCount-1){setFinished(true);window.scrollTo({top:0,behavior:"smooth"})}else{setPage(p=>Math.min(p+1,pageCount-1));window.scrollTo({top:0,behavior:"smooth"})}}}>{page===pageCount-1?"View my career profile":"Next section"}</button>
   </div>
   <p className="muted" style={{fontSize:13,marginTop:14}}>{answered} of {items.length} answered · Your answers stay on this page while you move between sections.</p>
  </div> : <>
   <div className="card">
    <span className="tag">YOUR CAREER INTEREST PROFILE</span>
    <h2 style={{fontSize:34,marginBottom:8}}>Your Holland interest code: {code}</h2>
    <p className="muted">Your three highest interest areas form a Holland-style RIASEC code. Use it as a conversation starter and a way to explore options, not as a fixed label or a job guarantee.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginTop:22}}>
     {results.map((r,i)=><div key={r.type} style={{padding:14,borderRadius:13,background:i<3?"#f0efff":"#f7f7fa",border:i<3?"1px solid #d9d6ff":"1px solid #ececf1"}}>
      <div style={{fontSize:12,fontWeight:800,color:"#625ce7"}}>{r.type} · {r.name.toUpperCase()}</div><div style={{fontSize:27,fontWeight:850,margin:"5px 0"}}>{r.score}%</div>
      <div style={{height:7,background:"#e5e5ef",borderRadius:20,overflow:"hidden"}}><div style={{width:r.score+"%",height:"100%",background:i===0?"#625ce7":"#9691ed"}}/></div>
     </div>)}
    </div>
   </div>
   <h2 style={{fontSize:28,margin:"28px 0 15px"}}>Your top career interest areas</h2>
   <div style={{display:"grid",gap:14}}>{results.slice(0,3).map((r,i)=><article className="card" key={r.type}>
    <span className="tag">MATCHING INTEREST {i+1} · {r.name}</span><h3 style={{fontSize:23}}>{r.title}</h3><p className="muted">{r.description}</p>
    <b>Career directions to explore</b><ul style={{paddingLeft:21,lineHeight:1.8,marginTop:8}}>{r.careers.map(c=><li key={c}>{c}</li>)}</ul>
    <b>Possible education and skill pathways</b><ul style={{paddingLeft:21,lineHeight:1.8,marginTop:8}}>{r.pathways.map(p=><li key={p}>{p}</li>)}</ul>
   </article>)}</div>
   <div className="card" style={{marginTop:18}}>
    <h3 style={{fontSize:23}}>Explore CosmoCareer learning</h3>
    <p className="muted">Your interest profile can help you choose what to explore next. Our current courses focus on practical digital and creative skills; they are not a substitute for formal qualifications required in regulated professions.</p>
    <a className="btn primary" href="/courses">Explore courses</a>
    <button type="button" className="btn" style={{marginLeft:10,background:"#f1f2f6",color:"#344054"}} onClick={restart}>Retake assessment</button>
   </div>
   <div className="card" style={{marginTop:14}}><h3 style={{fontSize:19}}>How to use this result</h3><ol style={{paddingLeft:22,lineHeight:1.8}}><li>Shortlist two or three careers from your top interest areas.</li><li>Check required qualifications, entrance exams and current job descriptions in India.</li><li>Speak with people doing the work and try a small project, course or job-shadowing experience.</li><li>Consider your academic performance, skills, financial situation and preferred lifestyle before deciding.</li></ol><p className="muted" style={{fontSize:13}}>This is an original, exploratory interest questionnaire inspired by the six-area RIASEC framework. It is not the official O*NET Interest Profiler, a clinical or psychometric diagnosis, or a validated predictor of job performance. CosmoCareer has not yet established reliability, validity or Indian population norms for this questionnaire.</p></div>
  </>}
  </div></section>
 </main>;
}

"use client";

import {useEffect,useState} from "react";
type Row={_id:string;assignmentId?:{_id:string;title:string;courseId?:{title:string}};studentId?:{name:string;email:string};status:string;submittedAt?:string};
export default function StaffAssignmentsPage(){
 const [rows,setRows]=useState<Row[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{fetch("/api/admin/assignment-submissions",{cache:"no-store"}).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Your account may not have permission to view submissions.");setRows(d.submissions||[])}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
 const assignments=Array.from(new Map(rows.filter(x=>x.assignmentId?._id).map(x=>[x.assignmentId!._id,x.assignmentId!])).values());
 return <main className="section"><div className="container"><a href="/employee">← Workspace</a><span className="tag">TEACHING & REVIEW</span><h1 style={{fontSize:36}}>Assignment workspace</h1><p className="muted">Review work submitted by learners in courses assigned to your account.</p>{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}{loading?<p className="muted">Loading assignments…</p>:assignments.length===0?<section className="card"><h2>No assignment submissions yet</h2><p className="muted">When learners submit work for courses you can review, the assignments will appear here. If you expected to see work, ask your administrator to check your course permissions.</p></section>:<div className="grid">{assignments.map(a=><article className="card" key={a._id}><h2>{a.title}</h2><p className="muted">{a.courseId?.title||"Course assignment"} · {rows.filter(x=>x.assignmentId?._id===a._id).length} submissions</p><a className="btn primary" href={"/staff/assignments/"+a._id}>Review submissions</a></article>)}</div>}</div></main>;
}

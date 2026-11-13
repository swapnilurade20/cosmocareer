"use client";

import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";

type Account={name:string;email:string;role:string;preferredLanguage:string};
const tiles=[
 {title:"My assignments",description:"Open assigned work and review learner submissions when your account has the required permissions.",href:"/staff/assignments",label:"Open assignments"},
 {title:"Learner dashboard",description:"Return to your account overview and account details.",href:"/dashboard",label:"My account"}
];

export default function StaffWorkspace({allowed}:{allowed:string[]}) {
 const [user,setUser]=useState<Account|null>(null);const [error,setError]=useState("");const [busy,setBusy]=useState(true);const router=useRouter();
 useEffect(()=>{let active=true;fetch("/api/auth/me",{cache:"no-store"}).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error("Please sign in to open your workspace.");if(!allowed.includes(d.user?.role))throw new Error("This workspace is not available to your account.");if(active)setUser(d.user)}).catch(e=>{if(active){setError(e.message);router.replace("/login")}}).finally(()=>{if(active)setBusy(false)});return()=>{active=false}},[allowed,router]);
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh()}
 return <main className="section"><div className="container">
  <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}><div><span className="tag">COSMOCAREER WORKSPACE</span><h1 style={{fontSize:36,margin:"12px 0 6px"}}>{busy?"Loading workspace…":user?"Welcome, "+user.name:"Staff workspace"}</h1><p className="muted">{user?.email||error}</p></div><button className="btn" onClick={logout}>Sign out</button></div>
  <section className="grid" style={{marginTop:24}}>{tiles.map(t=><article className="card" key={t.title}><h2>{t.title}</h2><p className="muted">{t.description}</p><a className="btn primary" href={t.href}>{t.label}</a></article>)}</section>
  <section className="card" style={{marginTop:20}}><h2>Access and permissions</h2><p className="muted">Your available actions depend on the role and permissions assigned by the administrator. If a page says you do not have permission, ask the administrator to review your account access. Do not share your password with anyone.</p></section>
 </div></main>;
}

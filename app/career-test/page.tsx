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
 {value:1,label:"Strongly dislike",hi:"बिल्कुल पसंद नहीं"},
 {value:2,label:"Dislike",hi:"पसंद नहीं"},
 {value:3,label:"Not sure",hi:"पक्का नहीं"},
 {value:4,label:"Like",hi:"पसंद है"},
 {value:5,label:"Strongly like",hi:"बहुत पसंद है"}
];
const typeOrder: TypeCode[] = ["R","I","A","S","E","C"];

const hiItems = [
"उपकरणों और मशीनों को जोड़ना, ठीक करना या उनकी देखभाल करना।","अपने हाथों से कोई चीज़ बनाना या तैयार करना।","कैमरा, लाइट, आवाज़ या वीडियो बनाने के उपकरणों के साथ काम करना।","मशीन, नेटवर्क या तकनीकी सिस्टम कैसे काम करते हैं, यह सीखना।","ऐसा व्यावहारिक काम करना जिसका नतीजा साफ दिखाई दे।","बाहर, किसी साइट पर या सक्रिय माहौल में काम करना।",
"किसी घटना का कारण जानना और सबूत ढूँढना।","डेटा, नंबर, पैटर्न या रिसर्च के साथ काम करना।","सोच-विचार करके मुश्किल समस्याएँ हल करना।","विज्ञान, तकनीक या विश्लेषण से जुड़ी बातें गहराई से सीखना।","किसी विचार को आज़माकर देखना कि वह काम करता है या नहीं।","फैसला लेने से पहले अलग-अलग जगहों की जानकारी की तुलना करना।",
"वीडियो, फोटो, ग्राफिक्स या कहानियाँ बनाना।","कहानी, स्क्रिप्ट, लेख या नए विचार लिखना।","ऐसी चीज़ डिज़ाइन करना जो उपयोगी भी हो और अच्छी भी दिखे।","संगीत, अभिनय या दूसरे रचनात्मक काम करना।","किसी बात को समझाने के नए तरीके ढूँढना।","ऐसे प्रोजेक्ट करना जिनमें नए विचार और कल्पना की ज़रूरत हो।",
"किसी को नया कौशल सिखाना या कठिन बात आसान भाषा में समझाना।","किसी की बात ध्यान से सुनना और उसकी समस्या में मदद करना।","टीम के लोगों की मदद करना ताकि वे अच्छा काम कर सकें।","सीखने, सेहत या समाज से जुड़ी गतिविधियों की योजना बनाना।","अलग-अलग लोगों के साथ अच्छे संबंध बनाना।","लोगों का आत्मविश्वास और ज्ञान बढ़ाने में मदद करना।",
"दूसरों को किसी विचार, सामान या सेवा के लिए तैयार करना।","किसी प्रोजेक्ट की ज़िम्मेदारी लेना और फैसले करना।","बातचीत, नेटवर्किंग और काम के संबंध बनाना।","कोई काम या बिज़नेस शुरू करना और ग्राहक ढूँढना।","लक्ष्य तय करना और दूसरों को उसे पाने के लिए प्रेरित करना।","अपने विचार पेश करना और नतीजों की ज़िम्मेदारी लेना।",
"फाइल, रिकॉर्ड, समय-सारणी और जानकारी को व्यवस्थित रखना।","छोटी-छोटी गलतियाँ ढूँढना और उन्हें ठीक करना।","बजट, हिसाब, स्प्रेडशीट या रिपोर्ट के साथ काम करना।","सही तरीके से काम पूरा करने के लिए तय प्रक्रिया अपनाना।","डेटाबेस और जानकारी को अपडेट रखना।","काम की योजना बनाना और समय-सीमा पर नज़र रखना।"
];
const hiProfiles: Record<TypeCode, {name:string;title:string;description:string;careers:string[];pathways:string[]}> = {
 R:{name:"व्यावहारिक (Realistic)",title:"काम करके सीखने वाले",description:"आपको उपकरणों, तकनीक, मशीनों, चीज़ें बनाने या ठीक करने और बाहर काम करने में रुचि हो सकती है।",careers:["इलेक्ट्रिकल / इलेक्ट्रॉनिक्स तकनीशियन","मैकेनिकल या सिविल तकनीशियन","फील्ड सर्विस असोसिएट","वीडियो प्रोडक्शन तकनीशियन","नेटवर्क सपोर्ट तकनीशियन"],pathways:["संबंधित ट्रेड में डिप्लोमा या ITI","इंजीनियरिंग या तकनीकी डिग्री","प्रैक्टिकल प्रोजेक्ट, अप्रेंटिसशिप और सुरक्षा प्रशिक्षण"]},
 I:{name:"खोजी (Investigative)",title:"जिज्ञासु समस्या हल करने वाले",description:"आपको सवालों के जवाब ढूँढना, जानकारी जाँचना, रिसर्च करना और मुश्किल समस्याएँ हल करना पसंद हो सकता है।",careers:["डेटा एनालिस्ट","बिज़नेस एनालिस्ट","रिसर्च असिस्टेंट","क्वालिटी एनालिस्ट","साइबर सुरक्षा एनालिस्ट"],pathways:["गणित, विज्ञान या कॉमर्स की मजबूत बुनियाद","डेटा, प्रोग्रामिंग या रिसर्च के कोर्स","विश्लेषण से जुड़े प्रोजेक्ट का पोर्टफोलियो"]},
 A:{name:"रचनात्मक (Artistic)",title:"नए विचार बनाने वाले",description:"आपको डिज़ाइन, मीडिया, कहानी, अभिनय और नए तरीके से अपने विचार दिखाना पसंद हो सकता है।",careers:["वीडियो एडिटर","कंटेंट क्रिएटर","ग्राफिक / मोशन डिज़ाइनर","UX/UI डिज़ाइनर","कॉपीराइटर या स्क्रिप्ट राइटर"],pathways:["डिज़ाइन, मीडिया या कम्युनिकेशन की पढ़ाई","अपने काम का पोर्टफोलियो बनाना","क्रिएटिव सॉफ्टवेयर का अभ्यास"]},
 S:{name:"सामाजिक (Social)",title:"लोगों की मदद करने वाले",description:"आपको लोगों को सिखाना, समझाना, सुनना और उन्हें आगे बढ़ने में मदद करना पसंद हो सकता है।",careers:["शिक्षक / ट्रेनर (ज़रूरी योग्यता के साथ)","लर्निंग और डेवलपमेंट असोसिएट","कस्टमर सक्सेस असोसिएट","कम्युनिटी प्रोग्राम कोऑर्डिनेटर","HR / पीपल ऑपरेशंस असोसिएट"],pathways:["शिक्षा, मनोविज्ञान, सोशल वर्क या HR की पढ़ाई","नियमित पेशों के लिए मान्य योग्यता","कम्युनिकेशन और लोगों को सिखाने का अभ्यास"]},
 E:{name:"नेतृत्वकारी (Enterprising)",title:"पहल करने और आगे बढ़ने वाले",description:"आपको नेतृत्व करना, लोगों को मनाना, बातचीत करना और बिज़नेस के नए मौके बनाना पसंद हो सकता है।",careers:["बिज़नेस डेवलपमेंट असोसिएट","सेल्स एग्जीक्यूटिव","मार्केटिंग एग्जीक्यूटिव","स्टार्टअप संस्थापक","प्रोडक्ट या प्रोजेक्ट कोऑर्डिनेटर"],pathways:["बिज़नेस, कॉमर्स, मैनेजमेंट या मार्केटिंग की पढ़ाई","सेल्स, कम्युनिकेशन और प्रोजेक्ट का अनुभव","छोटे बिज़नेस आइडिया को आज़माना"]},
 C:{name:"व्यवस्थित (Conventional)",title:"योजना और व्यवस्था पसंद करने वाले",description:"आपको जानकारी, रिकॉर्ड, नंबर, हिसाब और तय प्रक्रिया के साथ सही तरीके से काम करना पसंद हो सकता है।",careers:["अकाउंट्स / फाइनेंस असिस्टेंट","ऑपरेशंस कोऑर्डिनेटर","MIS एग्जीक्यूटिव","बैंकिंग ऑपरेशंस असोसिएट","कम्प्लायंस / डॉक्यूमेंटेशन असिस्टेंट"],pathways:["कॉमर्स, अकाउंटिंग, एडमिन या डेटा की पढ़ाई","Excel, अकाउंटिंग और डॉक्यूमेंटेशन कौशल","सही रिकॉर्ड और रिपोर्ट बनाने का अभ्यास"]}
};


export default function CareerTestPage() {
 const [language,setLanguage] = useState<"en"|"hi">("en");
 const t=(en:string,hi:string)=>language==="hi"?hi:en;
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
  <div style={{position:"relative"}}>
  <div style={{position:"absolute",top:16,right:20,zIndex:20,display:"flex",alignItems:"center",gap:8,padding:"6px 8px",background:"rgba(255,255,255,0.96)",border:"1px solid #e5e7eb",borderRadius:12,boxShadow:"0 2px 10px rgba(16,24,40,0.08)"}}><span style={{fontSize:13,fontWeight:700,color:"#344054"}}>{t("Language:","भाषा:")}</span><button type="button" onClick={()=>setLanguage("en")} aria-pressed={language==="en"} style={{padding:"7px 11px",borderRadius:8,border:0,background:language==="en"?"#625ce7":"transparent",color:language==="en"?"white":"#344054",fontWeight:700,cursor:"pointer"}}>English</button><button type="button" onClick={()=>setLanguage("hi")} aria-pressed={language==="hi"} style={{padding:"7px 11px",borderRadius:8,border:0,background:language==="hi"?"#625ce7":"transparent",color:language==="hi"?"white":"#344054",fontWeight:700,cursor:"pointer"}}>हिन्दी</button></div>
  <section className="hero"><div className="container">
   <span className="tag">{t("COSMOCAREER • CAREER DISCOVERY","COSMOCAREER • करियर की खोज")}</span>
   <h1>{t("Find career directions that fit your interests.","अपनी रुचि के अनुसार करियर के रास्ते खोजें।")}</h1>
   <p>{t("Explore the kinds of activities you enjoy, discover your interest profile and get practical career pathways to investigate.","जानें कि आपको किस तरह के काम पसंद हैं। अपनी रुचि समझें और उनसे जुड़े करियर के विकल्प खोजें।")}</p>
   <p style={{fontSize:14,color:"#c7d2fe"}}>{t("36 statements · About 8–12 minutes · No right or wrong answers","36 सवाल · लगभग 8–12 मिनट · कोई सही या गलत जवाब नहीं")}</p>
  </div></section>
  </div>
  <section className="section"><div className="container" style={{maxWidth:900}}>
  {!finished ? <div className="card">
   <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><span className="tag">{t("CAREER INTEREST INVENTORY","करियर रुचि टेस्ट")}</span><b>{t("Section","भाग")} {page+1} {t("of","में से")} {pageCount}</b></div>
   <div style={{height:9,background:"#e9eaf5",borderRadius:20,margin:"18px 0 20px",overflow:"hidden"}}><div style={{width:(answered/items.length*100)+"%",height:"100%",background:"#7774f5",borderRadius:20}}/></div>
   <p className="muted" style={{fontSize:14,marginBottom:18}}>{t("Rate how much you would enjoy each activity. Answer based on your genuine interest, not whether you are already good at it.","हर काम के बारे में बताएं कि आपको वह कितना पसंद है। यह न सोचें कि आप उसमें अभी अच्छे हैं या नहीं।")}</p>
   <div style={{display:"grid",gap:14}}>
    {current.map((item,offset)=>{const index=start+offset;return <section key={index} style={{padding:"18px 20px",border:"1px solid #e7e8f0",borderRadius:16,background:"#fff"}}>
     <div style={{fontSize:13,fontWeight:800,color:"#7774f5",marginBottom:8}}>{t("QUESTION","सवाल")} {index+1} {t("OF","में से")} {items.length}</div>
     <h2 style={{fontSize:18,lineHeight:1.45,margin:"0 0 14px",fontWeight:750}}>{language==="hi"?hiItems[index]:item.text}</h2>
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
      {scale.map(option=><button key={option.value} type="button" onClick={()=>choose(index,option.value)} aria-pressed={answers[index]===option.value} style={{padding:"12px 9px",borderRadius:10,border:answers[index]===option.value?"2px solid #6965e8":"1px solid #e5e7eb",background:answers[index]===option.value?"#f0efff":"white",color:"#101828",fontSize:13,fontWeight:650,cursor:"pointer"}}>{language==="hi"?option.hi:option.label}</button>)}
     </div>
    </section>})}
   </div>
   <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:24,flexWrap:"wrap"}}>
    <button type="button" className="btn" style={{background:"#f1f2f6",color:"#344054"}} disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>{t("Previous","पिछला")}</button>
    <button type="button" className="btn primary" disabled={!complete} onClick={()=>{if(!complete)return;if(page===pageCount-1){setFinished(true);window.scrollTo({top:0,behavior:"smooth"})}else{setPage(p=>Math.min(p+1,pageCount-1));window.scrollTo({top:0,behavior:"smooth"})}}}>{page===pageCount-1 ? t("View my career profile","मेरा करियर परिणाम देखें") : t("Next section","अगला भाग")}</button>
   </div>
   <p className="muted" style={{fontSize:13,marginTop:14}}>{answered} {t("of","में से")} {items.length} {t("answered","जवाब दिए")} · {t("Your answers stay on this page while you move between sections.","अगले भाग में जाने पर आपके जवाब सुरक्षित रहेंगे।")}</p>
  </div> : <>
   <div className="card">
    <span className="tag">{t("YOUR CAREER INTEREST PROFILE","आपकी करियर रुचि")}</span>
    <h2 style={{fontSize:34,marginBottom:8}}>{t("Your Holland interest code:","आपका Holland रुचि कोड:")} {code}</h2>
    <p className="muted">{t("Your three highest interest areas form a Holland-style RIASEC code. Use it as a conversation starter and a way to explore options, not as a fixed label or a job guarantee.","आपकी सबसे ज़्यादा रुचि वाले तीन क्षेत्र मिलकर आपका RIASEC कोड बनाते हैं। इसे करियर के विकल्प खोजने के लिए इस्तेमाल करें। यह नौकरी की गारंटी नहीं है।")}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginTop:22}}>
     {results.map((r,i)=><div key={r.type} style={{padding:14,borderRadius:13,background:i<3?"#f0efff":"#f7f7fa",border:i<3?"1px solid #d9d6ff":"1px solid #ececf1"}}>
      <div style={{fontSize:12,fontWeight:800,color:"#625ce7"}}>{r.type} · {(language==="hi"?hiProfiles[r.type].name:r.name).toUpperCase()}</div><div style={{fontSize:27,fontWeight:850,margin:"5px 0"}}>{r.score}%</div>
      <div style={{height:7,background:"#e5e5ef",borderRadius:20,overflow:"hidden"}}><div style={{width:r.score+"%",height:"100%",background:i===0?"#625ce7":"#9691ed"}}/></div>
     </div>)}
    </div>
   </div>
   <h2 style={{fontSize:28,margin:"28px 0 15px"}}>{t("Your top career interest areas","आपकी सबसे ज़्यादा रुचि वाले करियर क्षेत्र")}</h2>
   <div style={{display:"grid",gap:14}}>{results.slice(0,3).map((r,i)=><article className="card" key={r.type}>
    <span className="tag">{t("MATCHING INTEREST","मेल खाता रुचि")} {i+1} · {language==="hi"?hiProfiles[r.type].name:r.name}</span><h3 style={{fontSize:23}}>{language==="hi"?hiProfiles[r.type].title:r.title}</h3><p className="muted">{language==="hi"?hiProfiles[r.type].description:r.description}</p>
    <b>{t("Career directions to explore","खोजने योग्य करियर विकल्प")}</b><ul style={{paddingLeft:21,lineHeight:1.8,marginTop:8}}>{(language==="hi"?hiProfiles[r.type].careers:r.careers).map(c=><li key={c}>{c}</li>)}</ul>
    <b>{t("Possible education and skill pathways","पढ़ाई और कौशल के रास्ते")}</b><ul style={{paddingLeft:21,lineHeight:1.8,marginTop:8}}>{(language==="hi"?hiProfiles[r.type].pathways:r.pathways).map(p=><li key={p}>{p}</li>)}</ul>
   </article>)}</div>
   <div className="card" style={{marginTop:18}}>
    <h3 style={{fontSize:23}}>{t("Explore CosmoCareer learning","CosmoCareer के कोर्स देखें")}</h3>
    <p className="muted">{t("Your interest profile can help you choose what to explore next. Our current courses focus on practical digital and creative skills; they are not a substitute for formal qualifications required in regulated professions.","आपकी रुचि आपको अगला कदम चुनने में मदद कर सकती है। हमारे कोर्स डिजिटल और क्रिएटिव कौशल सिखाते हैं। ये उन पेशों की ज़रूरी डिग्री या योग्यता की जगह नहीं लेते जिनमें औपचारिक योग्यता चाहिए।")}</p>
    <a className="btn primary" href="/courses">{t("Explore courses","कोर्स देखें")}</a>
    <button type="button" className="btn" style={{marginLeft:10,background:"#f1f2f6",color:"#344054"}} onClick={restart}>{t("Retake assessment","टेस्ट दोबारा दें")}</button>
   </div>
   <div className="card" style={{marginTop:14}}><h3 style={{fontSize:19}}>{t("How to use this result","इस परिणाम का उपयोग कैसे करें")}</h3><ol style={{paddingLeft:22,lineHeight:1.8}}><li>{t("Shortlist two or three careers from your top interest areas.","अपनी रुचि के क्षेत्रों से दो या तीन करियर चुनें।")}</li><li>{t("Check required qualifications, entrance exams and current job descriptions in India.","भारत में उन करियर की ज़रूरी पढ़ाई, प्रवेश परीक्षा और नौकरी की जानकारी देखें।")}</li><li>{t("Speak with people doing the work and try a small project, course or job-shadowing experience.","उस काम को करने वाले लोगों से बात करें। कोई छोटा प्रोजेक्ट या कोर्स करके देखें।")}</li><li>{t("Consider your academic performance, skills, financial situation and preferred lifestyle before deciding.","फैसला लेने से पहले अपनी पढ़ाई, कौशल, आर्थिक स्थिति और पसंद की जीवनशैली पर विचार करें।")}</li></ol><p className="muted" style={{fontSize:13}}>{t("This is an original, exploratory interest questionnaire inspired by the six-area RIASEC framework. It is not the official O*NET Interest Profiler, a clinical or psychometric diagnosis, or a validated predictor of job performance. CosmoCareer has not yet established reliability, validity or Indian population norms for this questionnaire.","यह छह क्षेत्रों वाले RIASEC ढाँचे से प्रेरित एक शुरुआती रुचि टेस्ट है। यह आधिकारिक O*NET टेस्ट नहीं है और न ही कोई प्रमाणित मनोवैज्ञानिक टेस्ट है। CosmoCareer ने अभी इस टेस्ट की विश्वसनीयता या भारत के लोगों के लिए इसकी सटीकता की जाँच नहीं की है।")}</p></div>
  </>}
  </div></section>
 </main>;
}

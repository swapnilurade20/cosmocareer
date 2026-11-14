"use client";

import {useMemo,useState} from "react";

type Area="Technology"|"Business"|"Creative"|"People"|"Analytical"|"Communication"|"Practical"|"Research"|"Care"|"Entrepreneurship";
type Question={text:string;options:{label:string;area:Area}[]};
const questions:Question[]=[
 {text:"Which activity would you most enjoy doing in a typical workday?",options:[{label:"Building apps, websites or using new technology",area:"Technology"},{label:"Planning a business, product or marketing campaign",area:"Business"},{label:"Creating videos, designs, stories or other content",area:"Creative"},{label:"Teaching, guiding or helping people",area:"People"}]},
 {text:"When you face a difficult problem, what do you naturally do first?",options:[{label:"Study the data and find the logical answer",area:"Analytical"},{label:"Research the topic and verify facts",area:"Research"},{label:"Try a practical solution and learn by doing",area:"Practical"},{label:"Discuss it and understand everyone's point of view",area:"Communication"}]},
 {text:"Which result would make you feel most proud?",options:[{label:"A useful digital tool or technical solution",area:"Technology"},{label:"A successful project, business or sales result",area:"Entrepreneurship"},{label:"A creative work that people love",area:"Creative"},{label:"Making a meaningful difference in someone's life",area:"Care"}]},
 {text:"Which kind of task sounds most interesting?",options:[{label:"Analysing numbers, trends and performance",area:"Analytical"},{label:"Writing, presenting or explaining ideas",area:"Communication"},{label:"Organising people, plans and deadlines",area:"Business"},{label:"Investigating a question in depth",area:"Research"}]},
 {text:"What type of environment would you prefer?",options:[{label:"A technology-focused team that keeps learning",area:"Technology"},{label:"A creative studio or media environment",area:"Creative"},{label:"A people-focused team, school or support service",area:"People"},{label:"Hands-on operations, equipment or field work",area:"Practical"}]},
 {text:"Which responsibility would you choose for a group project?",options:[{label:"Lead the plan and make decisions",area:"Entrepreneurship"},{label:"Present the idea and communicate with others",area:"Communication"},{label:"Research information and check accuracy",area:"Research"},{label:"Support the team and resolve people's concerns",area:"Care"}]},
 {text:"Which subject would you be most excited to learn?",options:[{label:"Programming, AI or cybersecurity",area:"Technology"},{label:"Finance, management or marketing",area:"Business"},{label:"Psychology, health or wellbeing",area:"Care"},{label:"Design, filmmaking or digital storytelling",area:"Creative"}]},
 {text:"How do you prefer to make important decisions?",options:[{label:"Compare evidence, numbers and possible outcomes",area:"Analytical"},{label:"Talk to people and understand their needs",area:"People"},{label:"Explore new possibilities and take a considered risk",area:"Entrepreneurship"},{label:"Test a practical option and observe the result",area:"Practical"}]},
 {text:"Which challenge would motivate you the most?",options:[{label:"Fixing a technical issue or building a digital product",area:"Technology"},{label:"Growing a brand or improving a company's results",area:"Business"},{label:"Creating something original from a blank page",area:"Creative"},{label:"Discovering new information and explaining what it means",area:"Research"}]},
 {text:"What do people most often rely on you for?",options:[{label:"Explaining things clearly and confidently",area:"Communication"},{label:"Listening, encouraging and helping them",area:"Care"},{label:"Finding patterns and solving complex problems",area:"Analytical"},{label:"Getting practical work organised and completed",area:"Practical"}]},
 {text:"Which work outcome matters most to you?",options:[{label:"Building something of my own",area:"Entrepreneurship"},{label:"Helping a team or organisation succeed",area:"Business"},{label:"Helping people learn and develop",area:"People"},{label:"Producing original creative work",area:"Creative"}]},
 {text:"Which daily activity would you enjoy most?",options:[{label:"Working with software, systems or digital tools",area:"Technology"},{label:"Writing reports, studying evidence or exploring ideas",area:"Research"},{label:"Meeting clients, presenting or negotiating",area:"Communication"},{label:"Supporting someone's wellbeing or progress",area:"Care"}]},
 {text:"When learning something new, which approach suits you?",options:[{label:"Experiment with tools and build a small project",area:"Practical"},{label:"Read deeply, investigate and take notes",area:"Research"},{label:"Discuss it with others and explain it back",area:"People"},{label:"Understand the business value and how to apply it",area:"Business"}]},
 {text:"Which future opportunity sounds most appealing?",options:[{label:"Data, finance or business intelligence",area:"Analytical"},{label:"Digital media, design or content creation",area:"Creative"},{label:"Starting a venture or launching a product",area:"Entrepreneurship"},{label:"Training, education or people development",area:"People"}]},
 {text:"If you could choose one project, what would it be?",options:[{label:"Develop a website, app or AI-powered solution",area:"Technology"},{label:"Research a real-world issue and recommend solutions",area:"Research"},{label:"Plan and run a small business campaign",area:"Business"},{label:"Create a service that improves people's lives",area:"Care"}]}
];
const careers:Record<Area,{roles:string[];description:string;courses:string[]}> = {
 Technology:{roles:["Software Developer","Web Developer","AI / Machine Learning Associate","Cybersecurity Analyst","Cloud Support Engineer"],description:"You may enjoy building, maintaining and improving digital systems. Try beginner coding projects before choosing a specialisation.",courses:["Web development","Programming fundamentals","AI tools and automation"]},
 Business:{roles:["Business Analyst","Digital Marketing Executive","Product Coordinator","Operations Executive","Sales and Growth Associate"],description:"You may enjoy helping organisations understand customers, improve processes and reach goals.",courses:["Business analysis","Digital marketing","Sales and project management"]},
 Creative:{roles:["Video Editor","Graphic Designer","Content Creator","UI/UX Designer","Motion Graphics Artist"],description:"You may thrive when turning ideas into engaging visual, audio or written experiences. Build a portfolio with real projects.",courses:["Video editing","Content creation","Graphic and UI/UX design"]},
 People:{roles:["Teacher or Trainer","HR Executive","Customer Success Associate","Learning and Development Coordinator","Career Guidance Assistant"],description:"You may find meaning in guiding, teaching and supporting people. Explore roles that combine empathy with strong professional skills.",courses:["Communication skills","Training and facilitation","Human resources"]},
 Analytical:{roles:["Data Analyst","Financial Analyst","Business Intelligence Associate","Quality Analyst","Risk Analyst"],description:"You may enjoy working with evidence, patterns and structured problem-solving. Practise spreadsheets, data visualisation and critical thinking.",courses:["Excel and data analytics","Business analysis","Financial literacy"]},
 Communication:{roles:["Public Relations Executive","Corporate Communications Associate","Content Strategist","Client Relationship Executive","Recruitment Consultant"],description:"You may enjoy explaining ideas, building relationships and communicating with different audiences.",courses:["Business communication","Content writing","Digital marketing"]},
 Practical:{roles:["IT Support Technician","Production Assistant","Field Operations Coordinator","Logistics Associate","Technical Service Associate"],description:"You may prefer applied work where you can solve concrete problems and see direct results. Try a hands-on course or internship.",courses:["Technical support","Operations basics","Video production"]},
 Research:{roles:["Research Assistant","Market Research Analyst","Policy Research Associate","UX Research Assistant","Scientific Communications Assistant"],description:"You may enjoy investigating questions, evaluating evidence and developing expertise in a subject area.",courses:["Research methods","Data analysis","Report writing"]},
 Care:{roles:["Psychology Assistant (where qualified)","Wellbeing Programme Coordinator","Community Outreach Associate","Healthcare Administration Assistant","Special Education Support (with training)"],description:"You may be drawn to people-centred work. Some psychology, counselling and healthcare roles require recognised qualifications or licences.",courses:["Psychology fundamentals","Communication skills","Healthcare administration"]},
 Entrepreneurship:{roles:["Startup Founder","Small Business Owner","Business Development Associate","E-commerce Operator","Product Entrepreneur"],description:"You may enjoy creating and testing new ideas. Start with a small project, validate customer demand and learn basic finance.",courses:["Entrepreneurship","Digital marketing","Finance and business planning"]}
};
const scale=["Not at all like me","A little like me","Somewhat like me","Mostly like me","Very much like me"];
export default function CareerTestPage(){
 const [answers,setAnswers]=useState<string[]>(Array(questions.length).fill(""));
 const [pageIndex,setPageIndex]=useState(0);
 const pageSize=5;
 const pageCount=Math.ceil(questions.length/pageSize);
 const pageStart=pageIndex*pageSize;
 const pageQuestions=questions.slice(pageStart,pageStart+pageSize);
 const pageComplete=pageQuestions.every((_,i)=>Boolean(answers[pageStart+i]));
 const [finished,setFinished]=useState(false);
 const answered=answers.filter(Boolean).length;
 const progress=Math.round(answered/questions.length*100);
 const results=useMemo(()=>Object.keys(careers).map(area=>{const key=area as Area;const total=answers.filter(answer=>answer===key).length;return {area:key,total,max:15,percent:Math.round(total/15*100)}}).sort((a,b)=>b.total-a.total),[answers]);
 const choose=(questionIndex:number,value:Area)=>setAnswers(old=>old.map((a,i)=>i===questionIndex?value:a));
 const restart=()=>{setAnswers(Array(questions.length).fill(""));setPageIndex(0);setFinished(false)};
 return <main>
  <section className="hero"><div className="container"><span className="tag">COSMOCAREER • CAREER DISCOVERY</span><h1>Discover career paths that match your interests.</h1><p>Answer 15 combined career questions. Choose the option that best matches your interests and strengths to explore suitable career directions.</p><p style={{fontSize:14,color:"#c7d2fe"}}>About 5 minutes · 15 questions · 5 questions per page · No right or wrong answers</p></div></section>
  <section className="section"><div className="container" style={{maxWidth:850}}>
   {!finished?<div className="card">
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><span className="tag">CAREER INTEREST ASSESSMENT</span><b>Page {pageIndex+1} of {pageCount}</b></div>
    <div style={{height:9,background:"#e9eaf5",borderRadius:20,margin:"18px 0 20px",overflow:"hidden"}}><div style={{width:progress+"%",height:"100%",background:"#7774f5",borderRadius:20}}/></div>
    <p className="muted" style={{fontSize:14,marginBottom:18}}>Answer all five questions on this page. Choose one option that best describes what you would enjoy.</p>
    <div style={{display:"grid",gap:22}}>
     {pageQuestions.map((question,offset)=>{const questionIndex=pageStart+offset;return <section key={questionIndex} style={{padding:"18px 20px",border:"1px solid #e7e8f0",borderRadius:16,background:"#fff"}}>
      <div style={{fontSize:13,fontWeight:800,color:"#7774f5",letterSpacing:".04em",marginBottom:10}}>QUESTION {questionIndex+1} OF {questions.length}</div>
      <h2 style={{fontSize:18,lineHeight:1.45,margin:"0 0 16px",fontWeight:750}}>{question.text}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:9}}>
       {question.options.map((option,i)=><button key={option.area} type="button" onClick={()=>choose(questionIndex,option.area)} aria-pressed={answers[questionIndex]===option.area} style={{textAlign:"left",padding:"13px 14px",borderRadius:11,border:answers[questionIndex]===option.area?"2px solid #6965e8":"1px solid #e5e7eb",background:answers[questionIndex]===option.area?"#f0efff":"white",color:"#101828",fontSize:14,lineHeight:1.5,fontWeight:650,cursor:"pointer"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:24,height:24,borderRadius:20,background:answers[questionIndex]===option.area?"#7774f5":"#f1f2f6",color:answers[questionIndex]===option.area?"white":"#475467",marginRight:9,fontSize:12}}>{String.fromCharCode(65+i)}</span>{option.label}</button>)}
      </div>
     </section>})}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:24,flexWrap:"wrap"}}>
     <button className="btn" style={{background:"#f1f2f6",color:"#344054"}} disabled={pageIndex===0} onClick={()=>setPageIndex(i=>i-1)}>Previous page</button>
     <button className="btn primary" disabled={!pageComplete} onClick={()=>{if(pageIndex===pageCount-1){setFinished(true);window.scrollTo({top:0,behavior:"smooth"})}else{setPageIndex(i=>i+1);window.scrollTo({top:0,behavior:"smooth"})}}}>{pageIndex===pageCount-1?"See my results":"Next page"}</button>
    </div>
    <p className="muted" style={{fontSize:13,marginTop:16}}>{answered} of {questions.length} answered · Five questions per page</p>
   </div>:<div>
    <div className="card"><span className="tag">YOUR CAREER DISCOVERY RESULTS</span><h2 style={{fontSize:34,marginBottom:8}}>Your strongest interest areas</h2><p className="muted">These results are a starting point for exploration, not a diagnosis, aptitude certification or guarantee of job fit.</p>
     <div style={{display:"grid",gap:17,marginTop:25}}>{results.slice(0,5).map((r,i)=><div key={r.area}><div style={{display:"flex",justifyContent:"space-between",gap:10,fontWeight:800,marginBottom:7}}><span>{i+1}. {r.area}</span><span>{r.percent}%</span></div><div style={{height:11,background:"#ececf4",borderRadius:20,overflow:"hidden"}}><div style={{width:r.percent+"%",height:"100%",background:i===0?"#625ce7":"#9a96f2"}}/></div></div>)}</div>
    </div>
    <h2 style={{fontSize:28,margin:"30px 0 16px"}}>Career paths to explore</h2>
    <div className="grid">{results.slice(0,3).map(r=>{const c=careers[r.area];return <article className="card" key={r.area}><span className="tag">{r.area}</span><h3 style={{fontSize:23}}>Explore {r.area.toLowerCase()} careers</h3><p className="muted">{c.description}</p><b>Possible roles</b><ul style={{paddingLeft:20,lineHeight:1.8}}>{c.roles.map(role=><li key={role}>{role}</li>)}</ul><b>Useful learning paths</b><p className="muted">{c.courses.join(" · ")}</p></article>})}</div>
    <div className="card" style={{marginTop:20}}><h3 style={{fontSize:23}}>Explore careers beyond our courses</h3><p className="muted">Your results may point to fields that are not currently taught on CosmoCareer. Research the required qualifications, speak with professionals and try a small project or beginner course before committing.</p><a className="btn primary" href="/courses">Explore CosmoCareer courses</a><button className="btn" style={{marginLeft:10,background:"#f1f2f6",color:"#344054"}} onClick={restart}>Retake test</button></div>
   </div>}
  </div></section>
 </main>
}

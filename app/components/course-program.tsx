import React from "react";

type Day = { day: number; title: string; detail: string };
type CoursePlan = { title: string; days: Day[] };
const makeDays=(items:string[]):Day[]=>items.map((title,i)=>({day:i+1,title,detail:title}));
const core:Record<string,CoursePlan>={
 "video-editing":{title:"Video Editing",days:makeDays(["Editing workflow and tools","Importing, timeline and basic cuts","Pacing and storytelling","Transitions and effects","Project 1: create a reel","Audio cleanup","Music and sound mixing","Captions and text","Project 2: reel with sound and captions","Colour basics","Motion text and animation","Formats and exports for Reels, YouTube and ads","Client briefs and feedback","Capstone: edit a 3-video portfolio","Capstone review and revision"])},
 "content-creator":{title:"Content Creation",days:makeDays(["Niche and audience","Competitor and trend research","Content planning and calendar","Phone shooting: light, sound and framing","Project 1: shoot a video","Hooks and scripts","Titles and thumbnails","Simple editing","Project 2: publish 3 posts","Posting schedule and analytics","Community and comments","Growth: collaborations and trends","Earning, brand deals, copyright and ethics","Capstone: 10-post channel/page and 30-day calendar","Capstone review and revision"])},
 "ai-video-creation":{title:"AI Video Creation",days:makeDays(["AI tools and workflow","Prompting for images","Prompting for video","Storyboards and scripts","Project 1: AI image story","AI voice and music","Subtitles and translation","Combining AI and real footage","Project 2: short AI reel","Editing AI clips","Making AI ads","Copyright, consent and honest labelling","Avoiding fake or misleading content","Capstone: explainer, AI ad and story reel","Capstone review and revision"])}
};
const careerDays:Day[]=[
{day:16,title:"Communication: confidence and clarity",detail:"Speaking, listening, body language, emails, messages and professional phone manners."},
{day:17,title:"Communication practice",detail:"Practise clear speaking, active listening and professional writing."},
{day:18,title:"Communication project",detail:"Submit a one-minute speaking video."},
{day:19,title:"Presentation skills",detail:"Structure a talk, organise slides and manage nerves."},
{day:20,title:"Presentation project",detail:"Record a three-minute presentation about your project."},
{day:21,title:"Company culture",detail:"Understand startups, large companies, family businesses and government workplaces."},
{day:22,title:"Teamwork and workplace habits",detail:"Practise feedback, office manners, emails and meetings."},
{day:23,title:"Company research project",detail:"Compare three companies and prepare interview questions."},
{day:24,title:"Work-life balance",detail:"Time planning, boundaries, stress awareness, routine, sleep and money basics."},
{day:25,title:"Personal balance project",detail:"Create your personal balance plan. This is general learning, not medical advice."}
];
const interviewDays:Day[]=[
{day:31,title:"Interview basics",detail:"Prepare a clear answer to “Tell me about yourself”."},
{day:32,title:"Skills and project questions",detail:"Explain your skills, decisions and portfolio projects."},
{day:33,title:"Company and role questions",detail:"Research an employer and understand the role."},
{day:34,title:"HR questions",detail:"Practise strengths, development areas and career goals."},
{day:35,title:"Mock interview 1: AI",detail:"Complete an AI-supported practice interview."},
{day:36,title:"Feedback and practice",detail:"Review feedback and improve your answers."},
{day:37,title:"Mock interview 2: human mentor",detail:"Complete a mentor-led mock interview."},
{day:38,title:"Salary and negotiation basics",detail:"Understand salary discussions and notice periods."},
{day:39,title:"Mock interview 3: full round",detail:"Complete a full-round mock interview with a human mentor."},
{day:40,title:"Final feedback and action plan",detail:"Receive final feedback and a personal next-step action plan."}
];
function DayList({days}:{days:Day[]}){return <ol className="course-day-list">{days.map(d=><li key={d.day}><b>Day {d.day}: {d.title}</b><p className="muted">{d.detail}</p></li>)}</ol>}
export default function CourseProgram({slug}:{slug:string}){
 const plan=core[slug];if(!plan)return null;
 return <div className="course-program-wrap" id="curriculum">
  <section className="card course-timeline">
   <span className="tag">YOUR 40-DAY LEARNING JOURNEY</span><h2>Course timeline</h2>
   <p className="muted">A clear five-stage plan from core skills to interview practice.</p>
   <ol className="timeline-five">
    <li><span>01</span><div><b>Days 1–15 · {plan.title} core skills</b><p>Learn the tools, practise essential techniques and complete course-specific projects.</p></div></li>
    <li><span>02</span><div><b>Days 16–25 · Career skills</b><p>Communication, presentations, company culture and work-life balance.</p></div></li>
    <li><span>03</span><div><b>Day 26 · Resume and portfolio</b><p>Create your resume and portfolio page for teacher review.</p></div></li>
    <li><span>04</span><div><b>Days 27–30 · Final projects and certificate</b><p>Finish pending work, complete the final assessment and meet certificate requirements.</p></div></li>
    <li><span>05</span><div><b>Days 31–40 · Mock interviews</b><p>Practise with AI and human mentors, then receive a personal action plan.</p></div></li>
   </ol>
  </section>
  <section className="card" style={{marginTop:20}}>
   <span className="tag">DETAILED SYLLABUS</span><h2>What happens each day</h2>
   <div className="grid course-syllabus-grid">
    <article><h3>Days 1–15 · {plan.title}</h3><DayList days={plan.days}/></article>
    <article><h3>Days 16–25 · Career skills</h3><DayList days={careerDays}/><p className="muted"><b>Projects:</b> one-minute speaking video, three-minute presentation, company comparison and personal balance plan.</p></article>
    <article><h3>Day 26 · Resume and portfolio</h3><p className="muted">Build a resume and portfolio page using the resume maker. A teacher reviews the submission.</p></article>
    <article><h3>Days 27–30 · Finish and certify</h3><p className="muted">Complete pending projects, final assessment and final score. Eligible students receive the course certificate on Day 30.</p></article>
    <article><h3>Days 31–40 · Mock interviews</h3><DayList days={interviewDays}/></article>
   </div>
  </section>
  <section className="card course-requirements" style={{marginTop:20}}>
   <h2>Access, progress and certificate rules</h2>
   <ul><li><b>Lifetime access:</b> recorded lessons, notes, submitted projects and issued certificates remain accessible for the lifetime defined in the Terms, subject to the platform continuing to operate.</li><li>Teacher reviews, live classes and mock interviews take place during the active 40-day batch. Recordings remain available for lifetime access.</li><li>Up to two devices per student account.</li><li>Batch learners follow the batch calendar. Self-paced learners unlock the next day after completing the previous day's lessons and quiz.</li><li>Lessons count as complete after 90% is watched. Quizzes require 60% to pass, with three attempts before a teacher reset.</li><li>Projects require teacher approval, with up to three resubmissions. Target review time is two working days.</li><li>Capstone unlocks on Day 14 after required core projects. Resume creation unlocks after career-skill modules.</li><li>Certificate requirements: 90% lesson completion, passed quizzes, approved projects and capstone, submitted resume, completed final assessment and 75% attendance for batch students.</li><li>Final score: 30% quizzes, 40% projects, 20% capstone and 10% attendance/participation.</li><li>Placement-ready badge: awarded after at least three mock interviews and the action plan. It is a profile badge, not a second certificate.</li></ul>
   <p className="muted">Batch dates, live-class timetable, support duration and refund window are confirmed before payment. Completion does not guarantee a job, salary, views, followers or income.</p>
  </section>
  <section className="placement-bottom">
   <div><span className="tag">AFTER DAY 40</span><h2>Placement support for your next step</h2><p>Get help updating your resume, improving your portfolio, preparing for opportunities, exploring freelance clients and planning your next career move.</p><small>The support period is set by the administrator for each batch and disclosed before enrolment. Placement support does not guarantee a job or salary.</small></div>
   <a className="btn primary" href="/placement-support">Explore placement support</a>
  </section>
 </div>;
}

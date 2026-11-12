import React from "react";

type Day = { day: number; title: string; detail: string };
type CoursePlan = { title: string; days: Day[] };
const core: Record<string, CoursePlan> = {
  "video-editing": { title: "Video Editing", days: [
    ["Editing workflow and tools","Understand the editing process and choose suitable tools."],["Importing, timeline and basic cuts","Organise footage, use the timeline and make clean cuts."],["Pacing and storytelling","Shape a clear story and maintain viewer attention."],["Transitions and effects","Use transitions and effects with purpose."],["Project 1: a reel","Create and submit your first edited reel."],["Audio cleanup","Remove unwanted noise and improve clarity."],["Music and sound mixing","Balance voice, music and sound effects."],["Captions and text","Add readable captions and on-screen text."],["Project 2: reel with sound and captions","Create a polished reel with audio and captions."],["Colour basics","Correct exposure, white balance and basic colour."],["Motion text and animation","Create simple animated titles and graphics."],["Formats and exports","Export correctly for Reels, YouTube and advertisements."],["Client briefs and feedback","Understand a brief and respond to revision notes."],["Capstone: 3-video portfolio","Edit three videos for a portfolio."],["Capstone review and revision","Receive feedback and revise the portfolio."]
  ].map((x,i)=>({day:i+1,title:x[0],detail:x[1]})) },
  "content-creator": { title: "Content Creation", days: [
    ["Niche and audience","Choose a topic and define the audience you want to serve."],["Competitor and trend research","Research other creators and relevant trends."],["Content planning and calendar","Build a practical content plan and calendar."],["Shoot with a phone","Practise lighting, sound and framing."],["Project 1: shoot a video","Shoot and submit a video."],["Hooks and scripts","Write strong openings and clear short scripts."],["Titles and thumbnails","Create accurate, clear titles and thumbnails."],["Simple editing","Edit a short video for publication."],["Project 2: publish 3 posts","Prepare and publish three posts on your own channel or page."],["Posting schedule and analytics","Plan a consistent schedule and read basic analytics."],["Community and comments","Respond constructively and build a healthy community."],["Growth: collaborations and trends","Explore collaborations and responsible trend use."],["Earning, copyright and ethics","Understand brand deals, services, copyright and creator ethics."],["Capstone: 10-post channel or page","Prepare a 10-post channel or page and a 30-day calendar."],["Capstone review and revision","Review and improve the channel or page plan."]
  ].map((x,i)=>({day:i+1,title:x[0],detail:x[1]})) },
  "ai-video-creation": { title: "AI Video Creation", days: [
    ["AI tools and workflow","Understand image, voice and video tools and a responsible workflow."],["Prompting for images","Write prompts for useful, consistent images."],["Prompting for video","Create video prompts with clear scenes and motion."],["Storyboards and scripts","Plan AI videos with scripts and storyboards."],["Project 1: AI image story","Create a short story using AI-generated images."],["AI voice and music","Explore voice and music generation responsibly."],["Subtitles and translation","Add subtitles and translate content accurately."],["Combine AI and real footage","Mix generated clips with real footage."],["Project 2: short AI reel","Create a short AI-assisted reel."],["Editing AI clips","Edit generated clips into a coherent video."],["Making AI ads","Create an AI-assisted advertisement."],["Copyright, consent and honest labelling","Understand rights, permissions and clear AI disclosure."],["Avoid fake or misleading content","Avoid deceptive people, claims, endorsements and synthetic evidence."],["Capstone: three AI videos","Create an explainer video, an AI ad and a story reel."],["Capstone review and revision","Review and revise all capstone videos."]
  ].map((x,i)=>({day:i+1,title:x[0],detail:x[1]})) }
};
const careerDays: Day[] = [
  {day:16,title:"Communication: confidence and clarity",detail:"Speaking with confidence, clear voice, listening, body language, emails, messages, phone and WhatsApp manners."},
  {day:17,title:"Communication practice",detail:"Practise clear speaking, active listening and professional written communication."},
  {day:18,title:"Communication project",detail:"Submit a one-minute speaking video."},
  {day:19,title:"Presentation skills",detail:"Structure a talk, organise slides and manage nerves."},
  {day:20,title:"Presentation project",detail:"Record a three-minute presentation about your own project and practise handling questions."},
  {day:21,title:"Company culture",detail:"Explore startups, large companies, family businesses and government workplaces; read job posts and assess culture."},
  {day:22,title:"Teamwork and workplace habits",detail:"Practise teamwork, feedback, office manners, emails, meetings and first-90-days basics."},
  {day:23,title:"Company research project",detail:"Compare three companies and prepare questions to ask in interviews."},
  {day:24,title:"Work-life balance",detail:"Time planning, saying no politely, stress and burnout awareness, routines, sleep and money basics."},
  {day:25,title:"Personal balance project",detail:"Create your personal balance plan. This is general learning, not medical or mental-health treatment."}
];
const interviewDays: Day[] = [
  {day:31,title:"Interview basics",detail:"Prepare a clear answer to “Tell me about yourself”."},
  {day:32,title:"Skills and project questions",detail:"Explain your skills, decisions and portfolio projects."},
  {day:33,title:"Company and role questions",detail:"Research an employer and understand the role."},
  {day:34,title:"HR questions",detail:"Practise strengths, development areas and career goals."},
  {day:35,title:"Mock interview 1: AI",detail:"Complete an AI-supported practice interview."},
  {day:36,title:"Feedback and practice",detail:"Review feedback and improve your answers."},
  {day:37,title:"Mock interview 2: human mentor",detail:"Complete a mentor-led mock interview."},
  {day:38,title:"Salary and negotiation basics",detail:"Understand salary discussions, notice periods and respectful negotiation."},
  {day:39,title:"Mock interview 3: full round",detail:"Complete a full-round mock interview with a human mentor."},
  {day:40,title:"Final feedback and action plan",detail:"Receive final feedback and a personal next-step action plan."}
];
function DayList({days}:{days:Day[]}) { return <ol style={{paddingLeft:22,display:"grid",gap:10}}>{days.map(d=><li key={d.day}><b>Day {d.day}: {d.title}</b><p className="muted" style={{margin:"3px 0 0"}}>{d.detail}</p></li>)}</ol>; }
export default function CourseProgram({slug}:{slug:string}) {
  const plan=core[slug]; if(!plan)return null;
  return <section className="card" style={{marginTop:24}} id="curriculum">
    <span className="tag">40-DAY PROGRAMME</span><h2>Course timeline and curriculum</h2>
    <p className="muted">The first 30 days are the learning programme. Days 31–40 are the mock-interview phase. Placement support follows the active programme.</p>
    <div className="grid" style={{marginTop:16}}>
      <article><h3>Days 1–15 · {plan.title} core skill</h3><DayList days={plan.days}/></article>
      <article><h3>Days 16–25 · Career skills</h3><DayList days={careerDays}/><p><b>Shared project:</b> a one-minute speaking video, a three-minute project presentation, a comparison of three companies with interview questions, and a personal balance plan.</p></article>
      <article><h3>Day 26 · Resume and portfolio</h3><p>Build a resume and portfolio page using the resume maker. A teacher reviews the submission.</p></article>
      <article><h3>Days 27–30 · Finish and certify</h3><p>Complete pending projects, final assessment and final score. Eligible students receive the course certificate on Day 30.</p></article>
      <article><h3>Days 31–40 · Mock interviews</h3><DayList days={interviewDays}/></article>
      <article><h3>After Day 40 · Placement support</h3><p>Resume updates, portfolio improvements, counselling, freelance-client guidance and placement tracking. The support period is set by the administrator for each batch and shown before enrolment.</p></article>
    </div>
    <hr style={{margin:"22px 0",border:0,borderTop:"1px solid #eaecf0"}}/>
    <h3>Course rules and completion requirements</h3>
    <ul style={{paddingLeft:20,lineHeight:1.85}}>
      <li><b>Lifetime learning access:</b> recorded lessons, notes, submitted projects, issued certificate and certificate verification remain accessible for the lifetime defined in the Terms, subject to the platform continuing to operate.</li>
      <li>Teacher reviews, live classes and mock interviews are part of the active batch period (Days 1–40). Recordings remain available for lifetime access.</li>
      <li>Device limit: up to two devices per student account.</li>
      <li>Batch students follow the batch calendar. Self-paced learners unlock the next day after completing the previous day's lessons and quiz.</li>
      <li>Lesson completion requires at least 90% watched. Module quizzes require 60%; students receive three attempts, after which a teacher may reset the quiz.</li>
      <li>Projects require teacher approval, with up to three resubmissions. Target review time: within two working days.</li>
      <li>Capstone unlocks on Day 14 after required core projects are completed. Resume creation unlocks after the career-skills modules.</li>
      <li>Certificate requirements: 90% lesson completion, all quizzes passed, projects and capstone approved, resume submitted, final assessment completed and at least 75% attendance for batch students.</li>
      <li>Final score: 30% quizzes, 40% projects, 20% capstone and 10% attendance/participation. The administrator may update the weights for future batches and must disclose them.</li>
      <li>Placement-ready profile badge: awarded after at least three mock interviews and completion of the personal action plan. It is a profile badge, not a second certificate.</li>
    </ul>
    <p className="muted">Batch dates, live-class timetable (planned: two per week), placement-support duration and refund window are confirmed in the offer and Terms before payment. Refund eligibility depends on the published window and lesson usage. Course completion and placement support do not guarantee a job, salary, views, followers or income.</p>
  </section>;
}

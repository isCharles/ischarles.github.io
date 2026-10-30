import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const frontend=process.env.ARDOR_FRONTEND_DIR;
if(!frontend)throw new Error('ARDOR_FRONTEND_DIR must point to a built Ardor frontend with its locked dependencies installed.');
const {chromium}=createRequire(resolve(frontend,'package.json'))('playwright');
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const out = resolve('public/ardor/screenshots');
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','-p','3128'], {stdio:'ignore',cwd:frontend});
const base='http://127.0.0.1:3128';
let browser;
try {
  for(let i=0;i<100;i++){try{if((await fetch(base+'/login')).ok)break;}catch{}await new Promise(r=>setTimeout(r,150));}
  browser=await chromium.launch({headless:true,...(process.env.ARDOR_CAPTURE_BROWSER ? {channel:process.env.ARDOR_CAPTURE_BROWSER}:{})});
  const context=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:2,timezoneId:'America/Chicago'});
  await context.addInitScript(()=>localStorage.setItem('ardor:locale','en'));
  // The LaTeX workspace renders a real page image; draw a synthetic A4 page so
  // the capture never needs a stored PDF or a user's resume.
  const previewPage=await context.newPage();
  await previewPage.setViewportSize({width:794,height:1123});
  await previewPage.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    html,body{margin:0;background:#fff;color:#1f2937;font-family:"Segoe UI",Arial,sans-serif}
    .page{width:794px;height:1123px;padding:60px 70px;box-sizing:border-box;background:#fff}
    h1{font-size:30px;margin:0;letter-spacing:.01em}
    .role{font-size:13.5px;color:#4b5563;margin:5px 0 0}
    .contact{font-size:10.5px;color:#6b7280;margin-top:9px;display:flex;gap:14px}
    h2{font-size:10px;letter-spacing:.16em;color:#6b7280;text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:5px;margin:22px 0 8px}
    p,li{font-size:11.5px;line-height:1.62;color:#374151;margin:3px 0}
    ul{margin:3px 0 0;padding-left:16px}
    .row{display:flex;justify-content:space-between;gap:16px;margin-top:8px}
    .row strong{font-size:12.5px;color:#111827}.row span{font-size:10.5px;color:#6b7280;white-space:nowrap}
    .tag{display:inline-block;border:1px solid #dbeafe;background:#f5f9ff;color:#1d4ed8;border-radius:4px;padding:2px 6px;font-size:10px;margin:2px 4px 0 0}
  </style></head><body><main class="page">
    <h1>Ethan Cole</h1><p class="role">Backend Engineer</p>
    <p class="contact"><span>Austin, TX</span><span>ethan.cole@example.invalid</span><span>github.com/ethan-cole-demo</span></p>
    <h2>Summary</h2>
    <p>Backend engineer with three years building shipment tracking and payout services. Focused on idempotency, retries, and observable failure recovery in Java and PostgreSQL.</p>
    <h2>Experience</h2>
    <div class="row"><strong>Northstar Freight · Backend Engineer</strong><span>2024 — Present</span></div>
    <ul><li>Own the payout retry path, including idempotency keys, ledger writes, and reconciliation checks.</li><li>Instrumented shipment events end to end, adding trace context and alert labels to shorten incident triage.</li></ul>
    <div class="row"><strong>Lonestar Labs · Software Engineering Intern</strong><span>2023.05 — 2023.08</span></div>
    <ul><li>Built an internal API for lab intake and added contract tests around retry behavior.</li></ul>
    <h2>Projects</h2>
    <div class="row"><strong>Payout retry pipeline · Idempotency and recovery</strong><span>2027.08 — 2028.02</span></div>
    <ul><li>Modeled the failure window between the ledger commit and the Kafka offset commit; added a stable business key and a unique constraint.</li><li>Kept processing records for duplicate deliveries and added a post-recovery reconciliation check.</li></ul>
    <div class="row"><strong>Shipment event tracing</strong><span>2026.11 — 2027.05</span></div>
    <ul><li>Added trace context and service-level alerts to a multi-step shipment event pipeline.</li></ul>
    <h2>Education</h2>
    <div class="row"><strong>Cedar Ridge University · B.S. Computer Science</strong><span>2020.08 — 2024.05</span></div>
    <h2>Skills</h2>
    <p><span class="tag">Java</span><span class="tag">Kotlin</span><span class="tag">PostgreSQL</span><span class="tag">Kafka</span><span class="tag">Redis</span><span class="tag">Kubernetes</span><span class="tag">OpenTelemetry</span></p>
  </main></body></html>`);
  await previewPage.evaluate(()=>document.fonts.ready);
  const latexPageImage=await previewPage.screenshot({type:'png'});
  await previewPage.close();
  await context.route('**/latex-api/**',route=>route.fulfill({status:200,headers:{'Content-Type':'image/png','X-Page-Count':'1'},body:latexPageImage}));
  const date='2028-05-02T14:00:00Z';
  const conv={id:'showcase',title:'Map my final week before Harborline',createdAt:date,updatedAt:date,pinned:true};
  const report={id:'analysis',resumeId:'resume',modelName:'Demo model',createdAt:date,analysis:{
    overallScore:71,rubricVersion:'ardor-resume-rubric-v3',roleFamily:'backend',familyVersion:'ardor-resume-families-v1',
    dimensionScores:{technicalDepth:75,outcomes:50,ownership:75,clarity:100,roleFit:75,background:50},
    dimensionGrades:{technicalDepth:'B',outcomes:'C',ownership:'B',clarity:'A',roleFit:'B',background:'C'},
    dimensionBenchmarks:{technicalDepth:'A',outcomes:'B',ownership:'B',clarity:'B',roleFit:'A',background:'B'},
    summary:'The payments backend direction is clear, and the Northstar work is relevant. The next revision should separate what Ethan owned from what the team shipped, then replace component lists with failure windows, tradeoffs, and verification.',
    background:'Synthetic candidate: early-career backend engineer in Austin with three years of API and event-pipeline work. All names, companies, dates, and metrics are invented.',
    strengths:['Payment and shipment work includes retries, reconciliation, and observability, not just endpoint delivery.','The progression from feature work to service ownership is easy to follow.'],
    issues:[
      {severity:'A',dimensionId:'outcomes',category:'Outcome evidence',problem:'Payout latency claim has no baseline',why:'A percentage without traffic, window, or hardware makes the gain impossible to verify.',action:'Add test conditions, P95 before and after, and the measurement window; do not invent numbers.',evidence:'Cut payout latency by 40%.',example:'At the same traffic and database size, compare P95 before and after the retry change and state the sampling window.'},
      {severity:'A',dimensionId:'technicalDepth',category:'Correctness boundary',problem:`"Exactly once" is not scoped`,why:'Consuming a message, updating state, and writing the ledger are not one transaction by default.',action:'State what the offset commit, ledger transaction, and business idempotency key each guarantee, and how replays are verified.'},
      {severity:'A',dimensionId:'roleFit',category:'Role fit',problem:'Payments evidence sits below platform work',why:'The target role is explicitly payments backend, but the resume spends more space on generic infrastructure.',action:'Move the retry pipeline, reconciliation, and ledger consistency work into the top half.'},
      {severity:'B',dimensionId:'ownership',category:'Ownership',problem:'Team outcomes and personal ownership blend together',why:'A reader cannot tell which design decisions Ethan made.',action:'Name the service, the tradeoff, and the verification Ethan owned.'},
      {severity:'B',dimensionId:'technicalDepth',category:'Engineering depth',problem:'Cache consistency only shows the final design',why:'There is no evidence of how stale reads or write failures were handled.',action:'Describe the failure path and the recovery check.'},
      {severity:'B',dimensionId:'clarity',category:'Readability',problem:'Three projects open with the same generic sentence',why:'It slows down scanning for relevance.',action:'Open with the business object, the constraint, and the result.'},
      {severity:'C',dimensionId:'clarity',category:'Detail',problem:'Latency and volume units are inconsistent',why:'Mixed units reduce trust in the metrics.',action:'Use ms and requests/second consistently, and label peak versus median.'}
    ],
    scoringContext:{targetRole:'Harborline · Backend Engineer, Payments',mode:'GENERAL',roleFamily:'backend',rubricVersion:'ardor-resume-rubric-v3'}
  }};
  const plan={id:'plan',requestId:null,concept:'Idempotency keys for payout retries',reason:'From Harborline Round 1: Ethan could explain at-least-once delivery but not the failure window between the business write and the offset commit. Use it for the May 8 system-design round.',sourceType:'AGENT',sourceId:null,originKind:'AGENT',status:'IN_PROGRESS',
    lesson:{summary:'Start with one payout retry, draw the message, offset, and ledger states, and pin down where exactly-once actually holds.',keyPoints:['A message ID and a payment idempotency key are different identities.','A committed ledger write followed by a failed offset commit produces a duplicate delivery.','A checkpoint and an external transaction do not automatically cover every downstream side effect.'],explanation:'## Draw the three commit points first\n\nOne consume cycle includes the message fetch, the business write, and the offset commit. Only after their order is clear can you reason about failures.\n\n### The window people miss\n\nThe ledger row is committed, but the process exits before the offset is committed. After restart, the same message arrives again. An in-memory dedupe set is not enough.\n\n### Put idempotency at the business boundary\n\n1. Use a stable business key or unique constraint to recognize the same change.\n2. Write the business result and the processing record in one transaction.\n3. Record failed retries and duplicate requests separately; a successful replay is not a new business write.',example:'Scenario: the ledger row is committed, but the consumer crashes before the offset is acknowledged. How do you prevent a second hold on the same payout after restart?',pitfalls:['Do not stretch exactly-once into a global guarantee across every system.','Before deleting idempotency records, account for message retention and the latest retry window.']},
    exercises:[{question:'The ledger transaction commits, then the process exits before the offset commit. What happens after restart, and how do you verify recovery?',type:'SCENARIO'},{question:'How would you design a dedupe key when one request ID can trigger two different payout operations?',type:'SHORT_ANSWER'}],lastEvaluation:null,lastScore:null,attemptCount:1,scheduledAt:date,nextReviewAt:null,completedAt:null,createdAt:date};
  const recap={id:'recap',title:'Harborline · Backend Engineer, Round 1',overview:'The round moved from API design into idempotency, PostgreSQL isolation, Kafka retries, and a short payout design. The fundamentals were solid; the weak spots were the commit window, deadlock recovery, and proving the latency claim.',strengths:['Separated API and ledger responsibilities, and explained why the consumer must be idempotent.','A clear evidence-first debugging sequence for slow queries.','Recognized that retries do not create idempotency by themselves.'],weaknesses:['Did not describe the duplicate-write window between the ledger commit and the offset commit.','The latency improvement had no comparable baseline.','Cache failure and compensation paths were not developed.'],createdAt:'2028-04-30T21:00:00Z',jobOpportunityId:'process',questions:[{id:'q1',question:'How would you design a sliding-window rate limit for a high-traffic API?',answer:'Store request timestamps in a sorted set and trim the window before counting.',evaluation:'PARTIAL',feedback:'The direction is right, but trimming, counting, and writing must be one atomic operation.',topic:'Rate limiting'}]};
  recap.questions=recap.questions.map(q=>({id:q.id,sequenceNumber:1,questionText:q.question,candidateAnswer:q.answer,followUps:['Can a Lua script access two keys that live on different Redis Cluster slots?'],assessment:q.feedback,performance:'MIXED',weaknessReason:'The atomicity and same-slot constraints need a more precise explanation.',betterAnswer:null,tags:['Redis','concurrency']}));

  // This scenario is entirely fictional; it models real cross-domain complexity without copying an account.
  conv.title='Map my final week before Harborline';
  report.analysis.roleFamily='backend';
  report.analysis.overallScore=71;
  report.analysis.scoringContext={targetRole:'Harborline · Backend Engineer, Payments',jobDescription:'Own payment APIs and ledger writes; improve retry safety, reconciliation, and observability across Java services, PostgreSQL, and Kafka.',mode:'USER_JD',roleFamily:'backend',rubricVersion:'ardor-resume-rubric-v3'};
  report.analysis.summary='The payments backend direction is clear, and the Northstar work is relevant. The next revision should separate what Ethan owned from what the team shipped, then replace component lists with failure windows, tradeoffs, and verification. The payout retry project is the strongest evidence, but the latency claim needs a baseline and the idempotency boundary needs a scope.';
  report.analysis.background='Ethan Cole, B.S. Computer Science at Cedar Ridge University, three years as a backend engineer at Northstar Freight in Austin. He has shipped shipment tracking and payout services, and is targeting a payments backend role at Harborline. The resume shows relevant ownership, but cross-team delivery and production-scale evidence still need to be made explicit.';
  report.analysis.strengths=['Covers both API and event-pipeline work, with concrete retry, reconciliation, and tracing examples.','The payout project connects a business constraint to a technical decision instead of listing components.'];
  report.analysis.issues=[
    {severity:'A',category:'Outcome evidence',dimensionId:'outcomes',problem:'Payout latency claim has no baseline',why:'A percentage without traffic, window, or hardware makes the gain impossible to verify.',action:'Add test conditions, P95 before and after, and the measurement window; do not invent numbers.',evidence:'Cut payout latency by 40%.',example:'At the same traffic and database size, compare P95 before and after the retry change and state the sampling window.'},
    {severity:'A',category:'Correctness boundary',dimensionId:'technicalDepth',problem:`"Exactly once" is not scoped`,why:'Consuming a message, updating state, and writing the ledger are not one transaction by default.',action:'State what the offset commit, ledger transaction, and business idempotency key each guarantee, and how replays are verified.'},
    {severity:'A',category:'Role fit',dimensionId:'roleFit',problem:'Payments evidence sits below platform work',why:'The target role is explicitly payments backend, but the resume spends more space on generic infrastructure.',action:'Move the retry pipeline, reconciliation, and ledger consistency work into the top half.'},
    {severity:'B',category:'Ownership',dimensionId:'ownership',problem:'Team outcomes and personal ownership blend together',why:'A reader cannot tell which design decisions Ethan made.',action:'Name the service, the tradeoff, and the verification Ethan owned.'},
    {severity:'B',category:'Engineering depth',dimensionId:'technicalDepth',problem:'Cache consistency only shows the final design',why:'There is no evidence of how stale reads or write failures were handled.',action:'Describe the failure path and the recovery check.'},
    {severity:'B',category:'Readability',dimensionId:'clarity',problem:'Three projects open with the same generic sentence',why:'It slows down scanning for relevance.',action:'Open with the business object, the constraint, and the result.'},
    {severity:'C',category:'Detail',dimensionId:'clarity',problem:'Latency and volume units are inconsistent',why:'Mixed units reduce trust in the metrics.',action:'Use ms and requests/second consistently, and label peak versus median.'}
  ];
  const reportHistory=[
    report,
    {id:'analysis-bluepeak',resumeId:'resume',modelName:'Demo model',createdAt:'2028-04-20T14:00:00Z',analysis:{...report.analysis,overallScore:63,summary:'The backend fundamentals are solid, and the API examples are concrete. The next pass should make retry and consistency evidence easier to verify.',scoringContext:{...report.analysis.scoringContext,targetRole:'Bluepeak Health · Backend Engineer'}}},
    {id:'analysis-general',resumeId:'resume',modelName:'Demo model',createdAt:'2028-04-12T14:00:00Z',analysis:{...report.analysis,overallScore:67,summary:'The general backend story is complete and relevant. Separate outcomes from team ownership, then trim repeated infrastructure lists.',scoringContext:{...report.analysis.scoringContext,targetRole:'Backend Engineer (General)'}}}
  ];
  const historyTitles=['Harborline final-round prep','Payout retry review','Reorder the study week','Reconcile study blocks and calendar','Bluepeak Round 1 notes','Resume fit for payments','This week\'s application rhythm','Idempotency and retry boundaries','Remove duplicate study blocks','Explain the payout metrics','Weekend review plan','Check the practice feedback'];
  const conversations=[conv,...historyTitles.map((title,index)=>({...conv,id:'history-'+index,title,pinned:false}))];
  const messages=[
    {id:'earlier-user',role:'USER',content:'I saved my Harborline Round 1 notes. The final round is system design, so please do not regenerate the whole curriculum.',createdAt:'2028-05-01T15:00:00Z'},
    {id:'earlier-assistant',role:'ASSISTANT',content:'Context saved. I will reuse the existing lessons and keep where this came from separate from what to prepare next, so a weak answer from Round 1 does not get scheduled as if it were a new interview.',createdAt:'2028-05-01T15:00:06Z'},
    {id:'u',role:'USER',content:'Look at my calendar, interview pipeline, lessons, and flashcards, and map the next week. Do not rebuild the completed Redis lesson; read-only analysis first.',createdAt:date},
    {id:'a',role:'ASSISTANT',content:`Cross-check complete. I read the interview pipeline, lessons, calendar, and flashcards; I have not changed any schedule yet.

**First, separate final-round prep from leftover work**

- You have **6 lessons**: Redis is complete; Postgres isolation needs review; Kafka and tracing are in progress; the payout system-design replay has not started. The calendar has 5 open study blocks that match the 5 open lessons.
- Harborline's system-design round is **May 8 at 2:00 PM**. Idempotency and payout retries came from Round 1, so reuse the existing lesson instead of creating another one. Bluepeak is still waiting on a result, so it should not get interview-tomorrow priority.
- Postgres isolation is at **72 with 2 attempts**; the gap is deadlock recovery, not the isolation levels themselves. Kafka has the explanation read but no practice submitted, so do not count it as mastered.

**What actually needs a decision**

1. Rehearse idempotency before system design: finish the payout retry exercise on May 3, then re-answer it inside the payout pipeline on May 6. Do not just recite component names.
2. One calendar conflict: the Postgres block on **May 4 at 7:00 PM** overlaps the weekly **Payments guild sync**. Move the study block to 8:30 PM and leave the recurring meeting alone.
3. **13 flashcards are due**: 5 cover idempotency and consistency, 4 cover PostgreSQL, 4 cover Kafka. Use one 15-minute review block per day instead of creating 13 tasks.
4. Keep the completed Redis lesson: the 88-point attempt and the original explanation stay. It only needs its scheduled review on May 5.

Suggested order: **payout idempotency → Postgres deadlock recovery → Kafka rebalance → system-design replay**. If you agree, I will move that one conflicting block and leave every other record unchanged.`,createdAt:date,runId:'demo-run',runTrace:JSON.stringify({status:'COMPLETED',elapsedMs:26900,steps:[{label:'Read interview pipeline and next round',elapsedMs:16,status:'COMPLETED'},{label:'Read 6 lessons and practice history',elapsedMs:23,status:'COMPLETED'},{label:'Read calendar and recurring meetings',elapsedMs:18,status:'COMPLETED'},{label:'Read 13 due flashcards',elapsedMs:21,status:'COMPLETED'},{label:'Cross-check dates and sources',elapsedMs:41,status:'COMPLETED'}]})}
  ];
  const plans=[
    {...plan,concept:'Payout idempotency and retry boundaries',reason:'From Harborline Round 1: Ethan could explain at-least-once delivery but not the failure window between the ledger write and the offset commit. Scheduled before the May 8 system-design round.',originKind:'INTERVIEW_QUESTION',originResourceId:'q2',originRecordId:'recap',originInterviewId:'process',targetInterviewId:'process',targetRoundId:'r2',status:'IN_PROGRESS',attemptCount:1,lastScore:64,scheduledAt:'2028-05-03T23:30:00Z',lesson:{...plan.lesson,summary:'Start with one payout retry, draw the message, offset, and ledger states, and pin down where exactly-once actually holds.',keyPoints:['A message ID and a payment idempotency key are different identities.','A committed ledger write followed by a failed offset commit produces a duplicate delivery.','A checkpoint and an external transaction do not automatically cover every downstream side effect.'],explanation:'## Draw the three commit points first\n\nOne consume cycle includes the message fetch, the business write, and the offset commit. Only after their order is clear can you reason about failures.\n\n### The window people miss\n\nThe ledger row is committed, but the process exits before the offset is committed. After restart, the same message arrives again. An in-memory dedupe set is not enough.\n\n### Put idempotency at the business boundary\n\n1. Use a stable business key or unique constraint to recognize the same change.\n2. Write the business result and the processing record in one transaction.\n3. Record failed retries and duplicate requests separately; a successful replay is not a new business write.',example:'Scenario: the ledger row is committed, but the consumer crashes before the offset is acknowledged. How do you prevent a second hold on the same payout after restart?',pitfalls:['Do not stretch exactly-once into a global guarantee across every system.','Before deleting idempotency records, account for message retention and the latest retry window.']},exercises:[{question:'The ledger transaction commits, then the process exits before the offset commit. What happens after restart, and how do you verify recovery?',type:'SCENARIO'},{question:'How would you design a dedupe key when one request ID can trigger two different payout operations?',type:'SHORT_ANSWER'}]},
    {...plan,id:'plan2',concept:'PostgreSQL isolation and deadlock recovery',status:'NEEDS_REVIEW',attemptCount:2,lastScore:72,scheduledAt:'2028-05-05T00:00:00Z'},
    {...plan,id:'plan3',concept:'Kafka rebalances and retry backoff',status:'IN_PROGRESS',attemptCount:0,lastScore:null,scheduledAt:'2028-05-06T15:00:00Z'},
    {...plan,id:'plan4',concept:'Tracing a payment request end to end',status:'SCHEDULED',attemptCount:0,lastScore:null,scheduledAt:'2028-05-07T15:00:00Z'},
    {...plan,id:'plan5',concept:'System design: payout retries and reconciliation',status:'SCHEDULED',attemptCount:0,lastScore:null,scheduledAt:'2028-05-07T20:00:00Z'},
    {...plan,id:'plan6',concept:'Rate limiting with Redis and Lua',status:'COMPLETED',attemptCount:3,lastScore:88,nextReviewAt:'2028-05-05T14:00:00Z',completedAt:'2028-04-26T17:00:00Z'}
  ];
  const latexProject={id:'latex-demo',title:'Ethan Cole — Backend Engineer',mainFile:'main.tex',currentRevision:7,frozenRevision:null,frozenResumeId:null,createdAt:'2028-04-22T14:00:00Z',updatedAt:date};
  const latexSnapshot={projectId:'latex-demo',title:latexProject.title,mainFile:'main.tex',revisionNo:7,files:{'main.tex':'\\documentclass{article}\\begin{document}Ethan Cole\\end{document}'},sha256:'demo-latex-sha',frozenRevision:null,frozenResumeId:null,createdAt:'2028-04-22T14:00:00Z'};
  recap.title='Harborline · Backend Engineer, Round 1';
  recap.overview='The round moved from API design into idempotency, PostgreSQL isolation, Kafka retries, and a short payout design. The fundamentals were solid; the weak spots were the commit window, deadlock recovery, and proving the latency claim.';
  recap.strengths=['Separated API and ledger responsibilities, and explained why the consumer must be idempotent.','A clear evidence-first debugging sequence for slow queries.','Recognized that retries do not create idempotency by themselves.'];
  recap.weaknesses=['Did not describe the duplicate-write window between the ledger commit and the offset commit.','The latency improvement had no comparable baseline.','Cache failure and compensation paths were not developed.'];
  const topics=[
    ['Why did you put payout events on Kafka instead of writing the ledger from the API?','To decouple the API from ledger processing and absorb traffic spikes.','Directionally right, but name the allowed delay, replay behavior, and consistency cost.','MIXED','Needs a concrete latency budget and replay boundary.'],
    ['The ledger write committed, but the offset did not. What happens after a restart?','The message is delivered again, so the consumer needs to dedupe.','Identified the duplicate, but not the stable key, unique constraint, and transaction boundary.','WEAK','The idempotency key scope and retention window are missing.'],
    ['A payout query got slow. What do you check first?','Slow log, then the plan, index choice, rows scanned, and data distribution.','A clear evidence-first sequence; follow up on index-only scans and statistics.','STRONG',null],
    ['Why can adding consumers fail to reduce end-to-end latency?','The bottleneck may be the ledger write or a hot partition.','Good systems view; add backlog, batch size, and downstream rate limits.','MIXED','Throughput and latency should be measured separately.'],
    ['The cache update succeeds but the ledger write fails. How do you avoid a permanent mismatch?','Retry and run a scheduled reconciliation.','Needs a trusted source of truth, idempotent retries, and an alert when compensation fails.','WEAK','No observable recovery loop.'],
    ['How do you choose a rejection policy for a payout worker pool?','Classify by synchronous requests, background work, and whether the task can be compensated.','Good classification, but the caller-runs policy latency impact was not discussed.','MIXED','Tie it to a real failure case.'],
    ['When would you replay historical payout events, and how do you avoid duplicate side effects?','Rebuild a projection with an idempotent writer and a versioned result.','Shows good instincts about versioned outputs and idempotency.','STRONG',null],
    ['If you rebuilt the payout service, what would you change first?','Separate the API from the ledger worker and add one failure taxonomy and alert path.','Reasonable, but name the most frequent failure and how the change would be verified.','MIXED','Do not present a component swap as the outcome.']
  ];
  recap.questions=topics.map(([questionText,candidateAnswer,assessment,performance,weaknessReason],index)=>({id:'q'+(index+1),sequenceNumber:index+1,questionText,candidateAnswer,assessment,performance,weaknessReason,followUps:[],betterAnswer:'State the business constraint and failure window first, then the implementation boundary, tradeoffs, and verification. Do not replace a complete answer with a component name.',tags:index<2?['payments','idempotency']:['backend','tradeoffs']}));
  const opportunities=[
    {id:'process',company:'Harborline',targetRole:'Backend Engineer, Payments',platform:'Company site',status:'SCHEDULED',currentRound:2,createdAt:date,rounds:[
      {id:'r1',roundNumber:1,stage:'TECHNICAL',scheduledAt:'2028-04-30T19:00:00Z',occurredAt:'2028-04-30T19:00:00Z',durationMinutes:60,note:'APIs, idempotency, and Kafka'},
      {id:'r2',roundNumber:2,stage:'SYSTEM_DESIGN',scheduledAt:'2028-05-08T19:00:00Z',occurredAt:null,durationMinutes:60,note:'Payout retries and reconciliation'}]},
    {id:'process2',company:'Bluepeak Health',targetRole:'Backend Engineer',platform:'Referral',status:'AWAITING_RESULT',currentRound:1,rounds:[{id:'bluepeak-r1',roundNumber:1,stage:'TECHNICAL',scheduledAt:'2028-04-29T16:00:00Z',occurredAt:'2028-04-29T16:00:00Z',durationMinutes:45,note:'APIs and PostgreSQL'}]},
    {id:'process3',company:'Cedar & Co.',targetRole:'Software Engineer',platform:'Company site',status:'REJECTED',currentRound:1,rounds:[]}
  ];
  const calendarTasks=plans.filter(item=>item.status!=='COMPLETED').map(item=>({id:'task-'+item.id,title:item.concept,description:item.reason,dueAt:item.scheduledAt,priority:'MEDIUM',status:'TODO',source:'LEARNING_PLAN',sourceId:item.id,seriesId:null}));
  const memoryCards=Array.from({length:13},(_,index)=>({id:'card-'+index,front:index<5?'Idempotency and consistency: failure window '+(index+1):index<9?'PostgreSQL isolation: scenario '+(index-4):'Kafka retries: check '+(index-8),back:'Name the business constraint first, then the failure path, handling strategy, and verification.',status:'ACTIVE',recapQuestionId:'q'+(index%8+1),nextReviewAt:'2028-05-02T13:00:00Z'}));
  if(plans.length!==6||calendarTasks.length!==5||memoryCards.length!==13||recap.questions.length!==8||report.analysis.issues.length!==7)throw new Error('Scenario relationships must stay coherent');
  let cursor=0;
  const descriptors=[['root','RUN','agent.run',26900],['context','CONTEXT','Load trusted user and material context',42],['llm1','LLM','Identify the cross-module planning request',2300],['opps','TOOL','list_opportunities',16],['plans','TOOL','list_learning_plans',23],['tasks','TOOL','list_calendar_tasks',18],['rules','TOOL','list_recurring_tasks',11],['llm2','LLM','Cross-check lessons, interviews, and time',7400],['cards','TOOL','list_memory_cards',21],['detail','TOOL','get_learning_plan',17],['llm3','LLM','Evaluate conflicts and review priority',6100],['phase','THOUGHT','Keep completed records, write nothing yet',47],['llm4','LLM','Generate a sourced planning recommendation',10805]];
  const spans=descriptors.map(([id,kind,name,durationMs])=>{const startedAt=new Date(Date.parse(date)+cursor).toISOString();if(id!=='root')cursor+=durationMs;return {id,runId:'demo-run',parentSpanId:id==='root'?null:'root',kind,name,status:'COMPLETED',startedAt,finishedAt:new Date(Date.parse(startedAt)+durationMs).toISOString(),durationMs,model:kind==='LLM'?'deepseek-v4-flash':null,promptVersion:null,inputTokens:kind==='LLM'?3800:null,outputTokens:kind==='LLM'?640:null,cacheReadInputTokens:kind==='LLM'?2800:null,cacheCreationInputTokens:kind==='LLM'?0:null,errorCode:null,attributes:{}};});
  await context.route('**/api/**',async route=>{
    const p=new URL(route.request().url()).pathname;
    let body=[];
    if(p==='/api/auth/me')body={id:'demo',email:'ethan.cole@example.invalid',admin:false};
    else if(p==='/api/auth/csrf')body={token:'demo',headerName:'X-CSRF-TOKEN'};
    else if(p==='/api/profile')body={displayName:'Ethan Cole',headline:'Backend Engineer',targetRoles:['Backend Engineer, Payments'],timezone:'America/Chicago'};
    else if(p==='/api/profile/sidebar')body={userId:'demo',hrefs:['/app','/app/job-search','/app/learning','/app/calendar','/app/resumes','/app/latex'],revision:1,configured:true};
    else if(p==='/api/background-tasks/summary')body={activeCount:0,unreadByModule:{}};
    else if(p==='/api/agent/models')body=[{id:'PRIMARY',label:'deepseek-v4-flash',provider:'OPENAI_COMPATIBLE',available:true,nativeControl:true}];
    else if(p==='/api/agent/features')body=[];
    else if(p==='/api/agent/tools/schemas')body=[];
    else if(p==='/api/ai-jobs')body=[];
    else if(p==='/api/agent/runs/demo-run/trace')body={runId:'demo-run',conversationId:'showcase',status:'COMPLETED',durationMs:26900,totals:{llmCalls:4,toolCalls:6,loopRounds:3,inputTokens:15200,outputTokens:2560,cacheReadInputTokens:8400,cacheCreationInputTokens:0,cacheUsageMissingCalls:0},spans};
    else if(p==='/api/agent/conversations/showcase/trace')body={conversationId:'showcase',title:conv.title,nextBefore:null,runs:[{runId:'demo-run',message:messages[2].content,assistantMessage:messages[3].content,thinkingOutput:null,status:'COMPLETED',createdAt:date,updatedAt:date,spans}]};
    else if(p==='/api/agent/reasoning')body={nativeControl:true};
    else if(p==='/api/agent/permissions')body={globalLevel:0,modules:[]};
    else if(p==='/api/agent')body={conversationId:conv.id,llmConfigured:true,displayName:'Ethan Cole',conversations,archivedConversations:[],memory:{content:'Goal: payments backend at Harborline. Keep completed lessons.',updatedAt:date},messages};
    else if(p==='/api/resumes')body=[{id:'resume',originalFilename:'Ethan_Cole_Backend_Engineer_v4.pdf',contentType:'application/pdf',checksumSha256:'demo',parseStatus:'PARSED',createdAt:date,sizeBytes:132096,analysisId:'analysis',analysisStatus:'COMPLETED',analysisError:null,overallScore:71,primary:true,displayAnalysisId:'analysis'},{id:'resume-old',originalFilename:'Ethan_Cole_Platform_Engineer_v3.pdf',contentType:'application/pdf',checksumSha256:'demo',parseStatus:'PARSED',createdAt:'2028-04-20T14:00:00Z',sizeBytes:119808,analysisId:'analysis-bluepeak',analysisStatus:'COMPLETED',analysisError:null,overallScore:63,primary:false,displayAnalysisId:'analysis-bluepeak'},{id:'resume-archive',originalFilename:'Ethan_Cole_Software_Engineer_v2.pdf',contentType:'application/pdf',checksumSha256:'demo',parseStatus:'PARSED',createdAt:'2028-04-02T14:00:00Z',sizeBytes:114688,analysisId:null,analysisStatus:null,analysisError:null,overallScore:null,primary:false,displayAnalysisId:null}];
    else if(p==='/api/resumes/resume/analysis/history')body=reportHistory;
    else if(p==='/api/resumes/resume/analysis')body=report;
    else if(p==='/api/latex/projects')body=[latexProject];
    else if(p==='/api/latex/projects/latex-demo')body=latexSnapshot;
    else if(p==='/api/learning-plans')body=plans;
    else if(p==='/api/learning-plans/plan')body=plans[0];
    else if(p==='/api/interview-recaps')body=[recap];
    else if(p==='/api/interview-recaps/recap')body=recap;
    else if(p==='/api/opportunities')body=opportunities;
    else if(p.startsWith('/api/opportunities/'))body=opportunities.find(item=>item.id===p.split('/')[3])??{};
    else if(p==='/api/calendar/tasks')body=calendarTasks;
    else if(p==='/api/calendar/series')body=[{id:'weekly',title:'Payments guild sync',summary:'Every Thursday 19:00',status:'ACTIVE',upcoming:[]}];
    else if(p==='/api/memory-cards')body=memoryCards;
    else if(p==='/api/applications/rhythm')return route.fulfill({status:404,json:{message:'No synthetic rhythm'}});
    else if(p==='/api/agent/runs/latest')return route.fulfill({status:404,json:{message:'No active demo job'}});
    await route.fulfill({json:body});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const shots=[
    ['conversation','/app?conversation=showcase',/Map my final week before Harborline/],
    ['resume','/app/resumes','Competitiveness'],
    ['latex','/app/latex',/Ethan Cole — Backend Engineer|Write resume/],
    ['interview','/app/recaps?selected=recap','Harborline · Backend Engineer, Round 1'],
    ['learning','/app/learning?id=plan','Payout idempotency'],
    ['trace','/app/agent-runs/demo-run?conversation=showcase',/Conversation trace/]
  ];
  for(const [name,path,ready] of shots){
    await page.setViewportSize({width:1440,height:960});
    await page.goto(base+path);
    await page.getByText(ready,{exact:false}).first().waitFor({timeout:60000});
    if(name==='conversation')await page.getByText('Cross-check complete.',{exact:false}).scrollIntoViewIfNeeded();
    if(name==='latex'){
      const preview=page.locator('img[alt="Current resume"]');
      await preview.waitFor();
      await page.waitForFunction(()=>{const image=document.querySelector('img[alt="Current resume"]');return image&&image.complete&&image.naturalWidth>0;});
    }
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(600);
    const publicText=await page.locator('body').innerText();
    if(publicText.includes('fixture@')||publicText.includes('Synthetic agent reply'))throw new Error('Unfinished fixture text in capture');
    if(/[\u3400-\u9fff]/.test(publicText))throw new Error('Chinese text leaked into English capture: '+publicText.match(/[^\n]*[\u3400-\u9fff][^\n]*/)?.[0]);
    await page.screenshot({path:out+'/'+name+'-en.png',animations:'disabled'});
  }
  console.log(JSON.stringify({screenshots:shots.length,errors}));
  if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser?.close();server.kill();}

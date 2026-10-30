import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const frontend=process.env.ARDOR_FRONTEND_DIR;
if(!frontend)throw new Error('ARDOR_FRONTEND_DIR must point to a built Ardor frontend with its locked dependencies installed.');
const {chromium}=createRequire(resolve(frontend,'package.json'))('playwright');
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const out = resolve('public/ardor/screenshots');
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','-p','3127'], {stdio:'ignore',cwd:frontend});
const base='http://127.0.0.1:3127';
let browser;
try {
  for(let i=0;i<100;i++){try{if((await fetch(base+'/login')).ok)break;}catch{}await new Promise(r=>setTimeout(r,150));}
  browser=await chromium.launch({headless:true,...(process.env.ARDOR_CAPTURE_BROWSER ? {channel:process.env.ARDOR_CAPTURE_BROWSER}:{})});
  const context=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:2});
  await context.addInitScript(()=>localStorage.setItem('ardor:locale','zh-CN'));
  // The LaTeX workspace renders a real page image; draw a synthetic A4 page so
  // the capture never needs a stored PDF or a user's resume.
  const previewPage=await context.newPage();
  await previewPage.setViewportSize({width:794,height:1123});
  await previewPage.setContent(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>
    html,body{margin:0;background:#fff;color:#1f2937;font-family:"Segoe UI","Microsoft YaHei",sans-serif}
    .page{width:794px;height:1123px;padding:62px 72px;box-sizing:border-box;background:#fff}
    h1{font-size:31px;margin:0;letter-spacing:.02em}
    .role{font-size:14px;color:#4b5563;margin:5px 0 0}
    .contact{font-size:10.5px;color:#6b7280;margin-top:9px;display:flex;gap:14px}
    h2{font-size:10px;letter-spacing:.16em;color:#6b7280;text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:5px;margin:24px 0 9px}
    p,li{font-size:11.5px;line-height:1.7;color:#374151;margin:3px 0}
    ul{margin:3px 0 0;padding-left:16px}
    .row{display:flex;justify-content:space-between;gap:16px;margin-top:8px}
    .row strong{font-size:12.5px;color:#111827}.row span{font-size:10.5px;color:#6b7280;white-space:nowrap}
    .tag{display:inline-block;border:1px solid #dbeafe;background:#f5f9ff;color:#1d4ed8;border-radius:4px;padding:2px 6px;font-size:10px;margin:2px 4px 0 0}
  </style></head><body><main class="page">
    <h1>林澄</h1><p class="role">数据平台工程师</p>
    <p class="contact"><span>上海</span><span>lin.cheng@example.invalid</span><span>github.com/lin-cheng-demo</span></p>
    <h2>概述</h2>
    <p>三年数据开发经历，负责离线数仓与实时指标链路。关注消息幂等、任务恢复与数据质量，习惯把失败路径和验证方式写清楚。</p>
    <h2>工作经历</h2>
    <div class="row"><strong>澄光物流 · 数据平台工程师</strong><span>2025.06 — 至今</span></div>
    <ul><li>维护实时指标链路，围绕消费重试、幂等写入与数据质量告警补齐失败恢复路径。</li><li>拆分离线补算与实时消费的边界，统一指标口径与延迟观测方式。</li></ul>
    <div class="row"><strong>北岭零售 · 数据开发实习生</strong><span>2024.03 — 2024.08</span></div>
    <ul><li>参与离线数仓分层与报表任务迁移，整理任务依赖和失败重跑说明。</li></ul>
    <h2>项目</h2>
    <div class="row"><strong>实时指标看板 · 消息幂等与恢复</strong><span>2027.08 — 2028.02</span></div>
    <ul><li>梳理业务提交与消费位点提交之间的失败窗口，使用稳定业务键与唯一约束去重。</li><li>为重复投递和补算任务保留处理记录，补充恢复后的核对步骤。</li></ul>
    <div class="row"><strong>离线任务质量治理</strong><span>2026.11 — 2027.05</span></div>
    <ul><li>为关键报表增加校验规则与告警降噪，按影响范围区分阻断和提醒。</li></ul>
    <h2>教育</h2>
    <div class="row"><strong>江湾信息学院 · 信息管理 · 本科</strong><span>2020.09 — 2024.06</span></div>
    <h2>技能</h2>
    <p><span class="tag">SQL</span><span class="tag">Kafka</span><span class="tag">Flink</span><span class="tag">Redis</span><span class="tag">数据建模</span><span class="tag">任务调度</span></p>
  </main></body></html>`);
  await previewPage.evaluate(()=>document.fonts.ready);
  const latexPageImage=await previewPage.screenshot({type:'png'});
  await previewPage.close();
  await context.route('**/latex-api/**',route=>route.fulfill({status:200,headers:{'Content-Type':'image/png','X-Page-Count':'1'},body:latexPageImage}));
  const date='2028-04-16T09:00:00Z';
  const conv={id:'showcase',title:'为下一轮技术面试做准备',createdAt:date,updatedAt:date,pinned:true};
  const report={id:'analysis',resumeId:'resume',modelName:'Demo model',createdAt:date,analysis:{
    overallScore:73,rubricVersion:'ardor-resume-rubric-v3',roleFamily:'backend',familyVersion:'ardor-resume-families-v1',
    dimensionScores:{technicalDepth:75,outcomes:50,ownership:75,clarity:100,roleFit:75,background:50},
    dimensionGrades:{technicalDepth:'B',outcomes:'C',ownership:'B',clarity:'A',roleFit:'B',background:'C'},
    dimensionBenchmarks:{technicalDepth:'A',outcomes:'B',ownership:'B',clarity:'B',roleFit:'A',background:'B'},
    summary:'后端方向明确，项目链路完整。下一步应把“使用了什么技术”改写成“解决了什么问题，以及如何证明有效”。',
    background:'演示候选人：计算机相关专业，有后端项目与实习经历。以下内容为合成示例，不代表真实求职者。',
    strengths:['项目包含鉴权、异步任务和恢复机制，具备完整工程闭环。','技术表达清晰，核心职责边界明确。'],
    issues:[{severity:'A',dimensionId:'outcomes',category:'结果证据',problem:'性能优化缺少可复核的基线与对比',why:'招聘者需要区分真实收益与技术名词堆叠。',action:'补充测试条件、优化前后延迟及测量方式，不编造数字。',evidence:'原表述：优化了接口响应速度。',example:'在相同并发和数据量下，对比优化前后的 P95 延迟，并说明采样方法。'},
    {severity:'B',dimensionId:'ownership',category:'个人贡献',problem:'团队成果与本人负责部分混在一起',why:'需要判断独立解决问题的能力。',action:'明确本人负责的模块、技术取舍和验证结果。'},
    {severity:'C',dimensionId:'clarity',category:'表达细节',problem:'部分项目描述过长',why:'影响快速阅读。',action:'每条使用“问题—行动—结果”，统一日期与单位。'}],
    scoringContext:{targetRole:'数据平台工程师',mode:'GENERAL',roleFamily:'backend',rubricVersion:'ardor-resume-rubric-v3'}
  }};
  const plan={id:'plan',requestId:null,concept:'Redis 限流与 Lua 原子性',reason:'面试中能解释滑动窗口，但对并发原子性和 Cluster 哈希槽的边界还需巩固。',sourceType:'AGENT',sourceId:null,originKind:'AGENT',status:'IN_PROGRESS',
    lesson:{summary:'从一个真实接口出发，理解限流为什么不能只靠两条独立命令。',keyPoints:['滑动窗口：清理、计数与写入构成一个原子操作。','请求 ID 去重：同一请求重试不应重复计数。','Redis Cluster：相关 Key 使用相同 hash tag。'],explanation:'## 为什么需要原子性？\n\n当多个请求同时读取当前计数时，如果“检查”和“写入”分开执行，它们可能都认为还有名额。\n\n**核心原则：**把窗口清理、计数、判断和写入放进同一个 Lua 脚本，避免并发穿透。\n\n### 一个合理的实现顺序\n\n1. 清理时间窗口之外的记录。\n2. 检查 requestId 是否已经出现。\n3. 统计当前窗口请求数量。\n4. 未超过阈值时写入请求并设置过期时间。',example:'面试追问：如果 Lua 脚本需要同时访问全局限流 Key 和用户限流 Key，应如何保证两个 Key 在同一槽位？',pitfalls:['不要把“Lua 原子执行”误解为可以执行长时间阻塞操作。']},
    exercises:[{question:'为什么不能只用 ZADD 和 ZCARD 两条独立命令完成并发限流？',type:'SHORT_ANSWER'},{question:'如何设计全局限流与用户限流的 Key，使它们可以在同一个 Lua 脚本中访问？',type:'SCENARIO'}],lastEvaluation:null,lastScore:null,attemptCount:0,scheduledAt:date,nextReviewAt:null,completedAt:null,createdAt:date};
  const recap={id:'recap',title:'数据平台技术面试 · Redis 与并发控制',overview:'本次面试围绕缓存、限流和异步任务展开。基础概念较清晰，后续应补强并发正确性与故障恢复的具体实现。',strengths:['能够解释缓存穿透与缓存击穿的区别。','知道异步任务需要持久化状态与幂等标识。'],weaknesses:['滑动窗口的并发原子性解释不够完整。','需要进一步明确 Redis Cluster 的同槽约束。'],createdAt:date,jobOpportunityId:'process',questions:[{id:'q1',question:'如何为一个高并发接口设计滑动窗口限流？',answer:'使用有序集合保存请求时间戳，并按窗口清理、计数。',evaluation:'PARTIAL',feedback:'思路正确，还需要将清理、计数与写入放入同一个原子操作。',topic:'Redis 限流'}]};
  recap.questions=recap.questions.map(q=>({id:q.id,sequenceNumber:1,questionText:q.question,candidateAnswer:q.answer,followUps:['Redis Cluster 下两个 Key 不在同一个槽位时，Lua 脚本还能执行吗？'],assessment:q.feedback,performance:'MIXED',weaknessReason:'需要进一步说明并发原子性与同槽约束。',betterAnswer:null,tags:['Redis','并发控制']}));

  // This scenario is entirely fictional; it models real cross-domain complexity without copying an account.
  conv.title='面试、课程与日历交叉分析';
  report.analysis.roleFamily='engineering';
  report.analysis.overallScore=67;
  report.analysis.scoringContext={targetRole:'澄光物流 · 数据平台工程师',jobDescription:'负责实时指标链路、数据质量与任务调度，要求掌握 SQL、消息系统、幂等与可观测性。',mode:'USER_JD',roleFamily:'engineering',rubricVersion:'ardor-resume-rubric-v3'};
  report.analysis.summary='数据平台方向与岗位需求基本一致，离线链路和实时指标项目都有可继续展开的经历。当前最需要修正的是：用同一套口径讲清楚消息重复、延迟与数据一致性的取舍，而不是只罗列 Kafka、Flink 和 Redis。实时项目有吞吐量描述，但缺少数据规模、统计窗口及故障前后的对照；个人负责的调度与质量治理边界也应单独写清。';
  report.analysis.background='林澄，江湾信息学院信息管理本科，三年数据开发经历，曾在北岭零售负责离线数仓与指标服务。目标岗位更看重实时链路与可靠性经验，现有经历具有相关性，但规模化运营和跨团队交付的证据仍需补充。';
  report.analysis.strengths=['有实时与离线两条数据链路，能够围绕延迟、成本、质量解释工程选择。','项目包含调度失败补偿、数据质量告警与下游一致性校验，体现持续运维责任。'];
  report.analysis.issues=[
    {severity:'A',category:'结果证据',dimensionId:'outcomes',problem:'实时指标项目缺少可核验的性能基线',why:'仅有“降低延迟”，无法判断收益来自代码改动、机器扩容还是数据量变化。',action:'补齐数据规模、统计窗口、P95 延迟与资源使用条件；不要捏造结果。',evidence:'实时看板延迟显著降低，支持大规模数据处理。',example:'在相同数据量和资源配额下，比较端到端 P95 延迟；说明迟到数据与补算策略。'},
    {severity:'A',category:'正确性边界',dimensionId:'technicalDepth',problem:'“Exactly-once”表述没有限定生效范围',why:'消息消费、状态更新与下游数据库写入并不自动构成一个事务。',action:'明确 checkpoint、事务 sink 和业务幂等分别解决什么问题，以及重试时如何验证。'},
    {severity:'A',category:'岗位匹配',dimensionId:'roleFit',problem:'数据质量治理经验藏在项目末尾',why:'目标岗位明确要求质量与任务调度，当前履历却把篇幅放在组件列表。',action:'将数据校验、告警降噪与恢复闭环提升为独立贡献。'},
    {severity:'B',category:'个人贡献',dimensionId:'ownership',problem:'团队平台建设与本人负责部分混在一起',why:'招聘者无法辨别独立决策与参与实施的边界。',action:'分别写清本人负责的调度模块、方案取舍和验收方法。'},
    {severity:'B',category:'工程深度',dimensionId:'technicalDepth',problem:'缓存一致性只写了最终方案，没有说明失败路径',why:'缺少对异常重试和补偿策略的理解证据。',action:'补充消息重复、过期数据与写失败后的处理路径。'},
    {severity:'B',category:'可读性',dimensionId:'clarity',problem:'三个项目使用相同的泛化开头',why:'读者难以快速识别各项目解决的问题。',action:'每个项目用业务对象、约束与本人结果开头。'},
    {severity:'C',category:'表达细节',dimensionId:'clarity',problem:'吞吐量、时间单位和日期格式不统一',why:'降低对指标的信任，也增加阅读负担。',action:'统一 ms、条/秒与 YYYY.MM，说明指标是否为峰值。'}
  ];
  const reportHistory=[
    report,
    {id:'analysis-south',resumeId:'resume',modelName:'Demo model',createdAt:'2028-04-08T09:00:00Z',analysis:{...report.analysis,overallScore:59,summary:'实时开发方向与岗位要求较接近，消息链路和 SQL 排查有具体例子。下一步应把消费失败窗口、指标口径和恢复验证写得更可核对。',scoringContext:{...report.analysis.scoringContext,targetRole:'南屿数据 · 实时数据开发工程师'}}},
    {id:'analysis-general',resumeId:'resume',modelName:'Demo model',createdAt:'2028-04-02T09:00:00Z',analysis:{...report.analysis,overallScore:64,summary:'通用数据平台方向的基础完整，项目与岗位相关。建议先把结果证据与个人贡献分开，再压缩重复的组件列表。',scoringContext:{...report.analysis.scoringContext,targetRole:'数据平台工程师（通用）'}}}
  ];
  const historyTitles=['澄光物流二面准备','实时链路复盘与改写','课程优先级重新安排','复习任务与日历对账','南屿数据一面纪要','简历的岗位适配建议','本周投递节奏回顾','消息幂等与重试边界','取消重复的学习安排','把项目指标讲清楚','周末复习计划','检查课程练习反馈'];
  const conversations=[conv,...historyTitles.map((title,index)=>({...conv,id:'history-'+index,title,pinned:false}))];
  const messages=[
    {id:'earlier-user',role:'USER',content:'我已整理好澄光物流的一面纪要，下一轮偏系统设计，先别重新生成课程。',createdAt:'2028-04-15T10:00:00Z'},
    {id:'earlier-assistant',role:'ASSISTANT',content:'已保存这轮上下文。后续优先复用现有课程，并把“面试来源”和“准备目标”分开，避免把一面的薄弱题误当成下一轮面试安排。',createdAt:'2028-04-15T10:00:06Z'},
    {id:'u',role:'USER',content:'结合我的日历、面试进度、课程和记忆卡，看看未来一周怎么安排。Redis 已完成的课程不要重建，先只读分析。',createdAt:date},
    {id:'a',role:'ASSISTANT',content:'交叉核对完成。我读取了面试流程、课程、日历和记忆卡，尚未修改任何安排。\n\n**先区分：哪些是面试准备，哪些只是历史遗留**\n\n- 你有 **6 门课程**：Redis 已完成；线程池待巩固；JVM 与消息幂等学习中；SQL 和链路可观测性尚未开始。日历里有 5 条未完成学习安排，与这 5 门课程对应。\n- 澄光物流的系统设计二面在 **4 月 21 日 14:00**。实时链路与消息幂等来自它的一面，应优先复用现有课程，不再新建同主题。南屿数据仍在等一面结果，不必按“明天面试”的紧急程度安排。\n- 线程池最近练习 **68 分、2 次提交**，问题在拒绝策略与任务补偿；JVM 已读讲解但尚未提交练习，不能当成已掌握。\n\n**真正需要处理的是节奏和冲突**\n\n1. 先补消息幂等，再练系统设计：4 月 17 日晚上完成消费重试与重复写入的练习，18 日把它放回实时指标链路中重答。不要只背组件名。\n2. 日历有一处冲突：4 月 18 日 19:00 的线程池复习与固定小组例会重叠；建议移到同日 20:30，固定安排不动。\n3. 13 张记忆卡已到期：其中 5 张涉及消息与一致性、4 张是 JVM、4 张是 SQL。每天安排 15 分钟集中复习，不必拆成 13 条待办。\n4. Redis 已完成，保留不重建：最近一次 86 分的练习记录和原讲解都保留，只需按原计划在 4 月 19 日复习。\n\n建议顺序：**消息幂等 → 线程池补偿 → 系统设计重答 → SQL 查漏补缺**。如果你同意，我再修改那一条冲突的日程，其余记录保持不变。',createdAt:date,runId:'demo-run',runTrace:JSON.stringify({status:'COMPLETED',elapsedMs:26900,steps:[{label:'读取面试流程与下一轮安排',elapsedMs:16,status:'COMPLETED'},{label:'读取 6 门学习课程与练习记录',elapsedMs:23,status:'COMPLETED'},{label:'读取日历与固定安排',elapsedMs:18,status:'COMPLETED'},{label:'读取 13 张到期记忆卡',elapsedMs:21,status:'COMPLETED'},{label:'交叉核对时间与来源',elapsedMs:41,status:'COMPLETED'}]})}
  ];
  const plans=[
    {...plan,concept:'消息幂等与消费重试边界',reason:'来源：澄光物流数据平台一面。候选人能说明至少一次投递，但未解释业务写入与消费位点提交之间的失败窗口。用于准备 4 月 21 日的系统设计二面。',originKind:'INTERVIEW_QUESTION',originResourceId:'q2',originRecordId:'recap',originInterviewId:'process',targetInterviewId:'process',targetRoundId:'r2',status:'IN_PROGRESS',attemptCount:1,lastScore:62,scheduledAt:'2028-04-17T11:00:00Z',lesson:{...plan.lesson,summary:'从一次消费重试开始，画出消息、位点与业务写入的三个状态，明确“只处理一次”到底在哪一层成立。',keyPoints:['消息 ID 与业务幂等键不是同一个身份。','业务提交成功、消费位点提交失败，会触发重复投递。','checkpoint 与外部事务并不会自动覆盖所有下游副作用。'],explanation:'## 先画清三个提交点\n\n一次消费至少包含消息拉取、业务写入和位点提交。只有明确它们的顺序，才能讨论失败后会发生什么。\n\n### 一个容易被忽略的窗口\n\n数据库已经提交，但进程在提交消费位点前退出。重启后同一条消息会再次到达。此时仅靠内存里的去重集合并不可靠。\n\n### 把幂等落到业务边界\n\n1. 使用稳定业务键或唯一约束识别同一次变更。\n2. 在同一事务中写入业务结果与处理记录。\n3. 对失败重试和重复请求分别记录，不能把成功重放当成新的业务写入。',example:'场景：订单已写入数据库，消费者在确认位点前崩溃。请说明重启后如何避免重复增加库存占用。',pitfalls:['不要将 Exactly-once 扩大成所有系统之间的全局保证。','删除幂等记录前必须考虑消息保留时间与最晚重试窗口。']},exercises:[{question:'业务事务提交后、位点提交前进程退出，会发生什么？你会如何验证恢复结果？',type:'SCENARIO'},{question:'同一请求 ID 被用于两种不同业务操作时，去重键应如何设计？',type:'SHORT_ANSWER'}]},
    {...plan,id:'plan2',concept:'线程池拒绝策略与补偿',status:'NEEDS_REVIEW',attemptCount:2,lastScore:68,scheduledAt:'2028-04-18T11:00:00Z'},
    {...plan,id:'plan3',concept:'JVM 内存与 G1 回收路径',status:'IN_PROGRESS',attemptCount:0,lastScore:null,scheduledAt:'2028-04-19T01:00:00Z'},
    {...plan,id:'plan4',concept:'SQL 执行计划与索引失效',status:'SCHEDULED',attemptCount:0,lastScore:null,scheduledAt:'2028-04-20T11:00:00Z'},
    {...plan,id:'plan5',concept:'实时链路的可观测性设计',status:'SCHEDULED',attemptCount:0,lastScore:null,scheduledAt:'2028-04-20T01:00:00Z'},
    {...plan,id:'plan6',concept:'Redis 限流与 Lua 原子性',status:'COMPLETED',attemptCount:3,lastScore:86,nextReviewAt:'2028-04-19T01:00:00Z',completedAt:'2028-04-14T12:00:00Z'}
  ];
  const latexProject={id:'latex-demo',title:'林澄 — 数据平台工程师',mainFile:'main.tex',currentRevision:7,frozenRevision:null,frozenResumeId:null,createdAt:'2028-03-30T09:00:00Z',updatedAt:date};
  const latexSnapshot={projectId:'latex-demo',title:latexProject.title,mainFile:'main.tex',revisionNo:7,files:{'main.tex':'\\documentclass{article}\\begin{document}林澄\\end{document}'},sha256:'demo-latex-sha',frozenRevision:null,frozenResumeId:null,createdAt:'2028-03-30T09:00:00Z'};
  recap.title='澄光物流 · 数据平台一面完整复盘';
  recap.overview='本轮围绕实时指标链路展开，依次追问消息投递、幂等写入、SQL 优化、缓存与任务恢复。候选人能解释组件职责，但对业务提交与消费确认的失败窗口、指标口径及恢复验证还不够具体。下一轮准备应优先补正确性边界，再完善架构取舍。';
  recap.strengths=['能区分离线补算与实时消费的约束，解释为什么不直接共用一套链路。','SQL 排查有明确步骤：慢日志、执行计划、索引选择与数据分布。','知道重试不能自动保证幂等，能够描述任务持久化状态。'];
  recap.weaknesses=['未说明业务提交成功、位点提交失败时的重复写入窗口。','性能收益缺少同等资源与数据规模下的对比口径。','缓存失效与下游更新失败的补偿路径没有展开。'];
  const topics=[
    ['实时指标为什么选择消息队列，而不是每次查询数据库聚合？','把写入链路与查询解耦，降低数据库负载，也能削峰。','方向正确，但还应说明允许的延迟、重放能力和数据一致性的代价。','MIXED','需要量化延迟容忍度与补算边界。'],
    ['业务已提交，但消费位点尚未提交，进程退出后如何恢复？','重启会重新拉取消息，所以需要去重。','能识别重复消费，但未落到稳定业务键、唯一约束与同一事务边界。','WEAK','幂等键的作用域、保留时间与失败窗口尚不完整。'],
    ['一个聚合 SQL 变慢，你会先查什么？','先看慢日志与执行计划，再查索引选择、扫描行数和数据分布。','排查顺序清晰，能够从证据缩小范围；可继续追问索引回表与统计信息。','STRONG',null],
    ['消费者扩容后，为什么不能保证端到端延迟一定下降？','可能瓶颈在数据库写入，也可能存在热点分区。','有系统性视角，还应补充积压、批量大小与下游限流的指标。','MIXED','还需要把吞吐量与延迟分开衡量。'],
    ['缓存更新成功、下游持久化失败时，如何避免长期不一致？','通过重试和定时校对补偿。','需要明确可信状态源、重试幂等与补偿失败告警，不能仅说“加重试”。','WEAK','缺少可观测、可验证的恢复闭环。'],
    ['线程池任务被拒绝时，如何选择拒绝策略？','不能统一丢弃，要根据同步请求、后台任务和可补偿性决定。','能够按业务约束分类，但未说明调用方执行对响应延迟的影响。','MIXED','建议结合一个具体失败案例说明补偿。'],
    ['什么情况下需要回放历史消息，如何避免副作用重复？','重建指标时回放，写入需要幂等，并区分统计版本。','解释了版本化结果和幂等的关系，具有较好的工程意识。','STRONG',null],
    ['如果重做这个平台，最先修改哪一个设计？','将调度与执行状态分离，并补充统一的失败分类和告警。','方向合理，但仍应指出现有最频繁的故障及设计改动的验证方式。','MIXED','不要把组件替换当作架构收益本身。']
  ];
  recap.questions=topics.map(([questionText,candidateAnswer,assessment,performance,weaknessReason],index)=>({id:'q'+(index+1),sequenceNumber:index+1,questionText,candidateAnswer,assessment,performance,weaknessReason,followUps:[],betterAnswer:'先明确业务约束和失败窗口，再给出实现边界、取舍及验证方法。不要用一个组件名替代完整答案。',tags:index<2?['消息系统','幂等与恢复']:['数据平台','工程取舍']}));
  const opportunities=[
    {id:'process',company:'澄光物流',targetRole:'数据平台工程师',platform:'官网',status:'SCHEDULED',currentRound:2,createdAt:date,rounds:[
      {id:'r1',roundNumber:1,stage:'TECHNICAL',scheduledAt:'2028-04-13T06:00:00Z',occurredAt:'2028-04-13T06:00:00Z',durationMinutes:60,note:'实时链路、幂等与恢复'},
      {id:'r2',roundNumber:2,stage:'SYSTEM_DESIGN',scheduledAt:'2028-04-21T06:00:00Z',occurredAt:null,durationMinutes:60,note:'实时指标系统设计'}]},
    {id:'process2',company:'南屿数据',targetRole:'实时数据开发工程师',platform:'内推',status:'AWAITING_RESULT',currentRound:1,rounds:[{id:'south-r1',roundNumber:1,stage:'TECHNICAL',scheduledAt:'2028-04-14T02:00:00Z',occurredAt:'2028-04-14T02:00:00Z',durationMinutes:45,note:'SQL 与数据质量'}]},
    {id:'process3',company:'晨岚零售',targetRole:'数仓开发工程师',platform:'官网',status:'REJECTED',currentRound:1,rounds:[]}
  ];
  const calendarTasks=plans.filter(item=>item.status!=='COMPLETED').map(item=>({id:'task-'+item.id,title:item.concept,description:item.reason,dueAt:item.scheduledAt,priority:'MEDIUM',status:'TODO',source:'LEARNING_PLAN',sourceId:item.id,seriesId:null}));
  const memoryCards=Array.from({length:13},(_,index)=>({id:'card-'+index,front:index<5?'消费幂等与一致性：失败窗口 '+(index+1):index<9?'JVM 内存与回收：场景 '+(index-4):'SQL 执行计划：排查 '+(index-8),back:'先明确业务约束，再说明失败路径、处理策略和验证方法。',status:'ACTIVE',recapQuestionId:'q'+(index%8+1),nextReviewAt:'2028-04-15T01:00:00Z'}));
  if(plans.length!==6||calendarTasks.length!==5||memoryCards.length!==13||recap.questions.length!==8||report.analysis.issues.length!==7)throw new Error('Scenario relationships must stay coherent');
  let cursor=0;
  const descriptors=[['root','RUN','agent.run',26900],['context','CONTEXT','加载可信用户与材料上下文',42],['llm1','LLM','识别跨模块规划请求',2300],['opps','TOOL','list_opportunities',16],['plans','TOOL','list_learning_plans',23],['tasks','TOOL','list_calendar_tasks',18],['rules','TOOL','list_recurring_tasks',11],['llm2','LLM','交叉核对课程、面试与时间',7400],['cards','TOOL','list_memory_cards',21],['detail','TOOL','get_learning_plan',17],['llm3','LLM','评估冲突与复习优先级',6100],['phase','THOUGHT','保留已完成记录，暂不写入',47],['llm4','LLM','生成有来源的规划建议',10805]];
  const spans=descriptors.map(([id,kind,name,durationMs])=>{const startedAt=new Date(Date.parse(date)+cursor).toISOString();if(id!=='root')cursor+=durationMs;return {id,runId:'demo-run',parentSpanId:id==='root'?null:'root',kind,name,status:'COMPLETED',startedAt,finishedAt:new Date(Date.parse(startedAt)+durationMs).toISOString(),durationMs,model:kind==='LLM'?'deepseek-v4-flash':null,promptVersion:null,inputTokens:kind==='LLM'?3800:null,outputTokens:kind==='LLM'?640:null,cacheReadInputTokens:kind==='LLM'?2800:null,cacheCreationInputTokens:kind==='LLM'?0:null,errorCode:null,attributes:{}};});
  await context.route('**/api/**',async route=>{
    const p=new URL(route.request().url()).pathname;
    let body=[];
    if(p==='/api/auth/me')body={id:'demo',email:'demo@example.invalid',admin:false};
    else if(p==='/api/auth/csrf')body={token:'demo',headerName:'X-CSRF-TOKEN'};
    else if(p==='/api/profile')body={displayName:'林澄',headline:'数据平台工程师',targetRoles:['数据平台工程师'],timezone:'Asia/Shanghai'};
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
    else if(p==='/api/agent')body={conversationId:conv.id,llmConfigured:true,displayName:'林澄',conversations,archivedConversations:[],memory:{content:'目标：数据平台工程师；保留已完成课程。',updatedAt:date},messages};
    else if(p==='/api/resumes')body=[{id:'resume',originalFilename:'林澄_数据平台工程师_v3.pdf',contentType:'application/pdf',checksumSha256:'demo',parseStatus:'PARSED',createdAt:date,sizeBytes:132096,analysisId:'analysis',analysisStatus:'COMPLETED',analysisError:null,overallScore:67,primary:true,displayAnalysisId:'analysis'},{id:'resume-old',originalFilename:'林澄_实时开发_v2.pdf',contentType:'application/pdf',checksumSha256:'demo',parseStatus:'PARSED',createdAt:'2028-04-10T09:00:00Z',sizeBytes:119808,analysisId:'old-analysis',analysisStatus:'COMPLETED',analysisError:null,overallScore:59,primary:false,displayAnalysisId:'old-analysis'},{id:'resume-archive',originalFilename:'林澄_数仓开发_v1.pdf',contentType:'application/pdf',checksumSha256:'demo',parseStatus:'PARSED',createdAt:'2028-03-22T09:00:00Z',sizeBytes:114688,analysisId:null,analysisStatus:null,analysisError:null,overallScore:null,primary:false,displayAnalysisId:null}];
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
    else if(p==='/api/calendar/series')body=[{id:'weekly',title:'数据平台小组例会',summary:'每周二 19:00',status:'ACTIVE',upcoming:[]}];
    else if(p==='/api/memory-cards')body=memoryCards;
    else if(p==='/api/applications/rhythm')return route.fulfill({status:404,json:{message:'No synthetic rhythm'}});
    else if(p==='/api/agent/runs/latest')return route.fulfill({status:404,json:{message:'No active demo job'}});
    await route.fulfill({json:body});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const shots=[
    ['conversation','/app?conversation=showcase',/面试、课程与日历交叉分析/],
    ['resume','/app/resumes','当前竞争力'],
    ['latex','/app/latex',/林澄 — 数据平台工程师|写简历/],
    ['interview','/app/recaps?selected=recap','澄光物流 · 数据平台一面完整复盘'],
    ['learning','/app/learning?id=plan','消息幂等'],
    ['trace','/app/agent-runs/demo-run?conversation=showcase',/多轮对话轨迹|对话轨迹/]
  ];
  for(const [name,path,ready] of shots){
    await page.setViewportSize({width:1440,height:960});
    await page.goto(base+path);
    await page.getByText(ready,{exact:false}).first().waitFor({timeout:60000});
    if(name==='conversation')await page.getByText('交叉核对完成。',{exact:false}).scrollIntoViewIfNeeded();
    if(name==='latex'){
      const preview=page.locator('img[alt="当前简历"]');
      await preview.waitFor();
      await page.waitForFunction(()=>{const image=document.querySelector('img[alt="当前简历"]');return image&&image.complete&&image.naturalWidth>0;});
    }
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(600);
    const publicText=await page.locator('body').innerText();
    if(publicText.includes('fixture@')||publicText.includes('Synthetic agent reply'))throw new Error('Unfinished fixture text in capture');
    await page.screenshot({path:out+'/'+name+'.png',animations:'disabled'});
  }
  console.log(JSON.stringify({screenshots:shots.length,errors}));
  if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser?.close();server.kill();}

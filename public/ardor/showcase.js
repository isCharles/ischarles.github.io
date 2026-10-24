const features = [
  {id:'conversation',path:'对话',kicker:'CONVERSATION, WITH CONTEXT',title:'你的目标和材料，不必每次从头解释。',description:'围绕已有简历、面试记录与学习计划展开对话，让回答落到具体准备方向。对话是工作台的入口，而不是另一个信息孤岛。',tags:['上下文引用','长期记忆','工具调用'],alt:'Ardor 对话界面：根据面试表现整理 Redis、线程池和异步任务的复习重点'},
  {id:'resume',path:'求职 / 简历诊断',kicker:'A RESUME, WITH PRIORITIES',title:'不仅给分，也指出最值得先改的地方。',description:'按岗位方向和规范化维度诊断简历，区分优先修改、结构改进与表达细节。建议落实到原文证据与改写方向，避免只得到一串泛泛而谈的评价。',tags:['岗位方向','维度评分','分级优化建议'],alt:'简历诊断界面：维度评分、雷达图与 A/B/C 优先级的修改建议'},
  {id:'interview',path:'求职 / 面试记录',kicker:'AN INTERVIEW, MADE REVIEWABLE',title:'把一场面试，留下可再次使用的记录。',description:'保存整理后的最终纪要，再异步生成问题、回答与反馈。真实面试有流程与轮次归属，复盘结果可以继续连接学习和重答，而不是停在一篇总结里。',tags:['最终纪要','逐题复盘','轮次归属'],alt:'面试复盘界面：问题与回答、表现反馈以及可补强的薄弱点'},
  {id:'learning',path:'学习 / 定向补强',kicker:'FEEDBACK, TURNED INTO PRACTICE',title:'知道哪里不会，还要能真正练起来。',description:'把薄弱点带入具体课程：结构化讲解、关键要点、场景练习与后续评估。学习不局限于面试来源，也可以围绕自己的目标独立开展。',tags:['Markdown 讲解','场景练习','复习与进度'],alt:'学习界面：六门不同状态的课程、消息幂等讲解、面试来源与准备目标及场景练习'},
  {id:'trace',path:'助手 / 执行追踪',kicker:'EXECUTION, MADE VISIBLE',title:'它做了什么，不只靠一句“已完成”。',description:'从对话轮次下钻到执行步骤，查看模型调用、工具与记录的耗时。图和详情分开呈现，方便排查任务停在哪里；追踪不等同于展示模型的私有思维链。',tags:['轮次追踪','步骤图','调用详情'],alt:'执行追踪界面：整行步骤图以及下方的对话轮次和选中步骤详情'},
];
const tabs=[...document.querySelectorAll('[data-feature]')], image=document.querySelector('#feature-image'), dialog=document.querySelector('#image-dialog');
let current=0;
function select(index,focus=false){
  current=(index+features.length)%features.length;const feature=features[current];
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
  document.querySelector('#feature-panel').setAttribute('aria-labelledby','tab-'+feature.id);
  for(const [key,value] of Object.entries({kicker:feature.kicker,title:feature.title,description:feature.description}))document.querySelector('#feature-'+key).textContent=value;
  document.querySelector('#screen-path').textContent='Ardor / '+feature.path;
  image.src='./screenshots/'+feature.id+'.png';image.alt=feature.alt;
  document.querySelector('#screen-open').setAttribute('aria-label','放大'+feature.path+'截图');
  document.querySelector('#feature-tags').replaceChildren(...feature.tags.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  if(focus)tabs[current].focus();
  if(dialog.open)updateDialog();
}
function updateDialog(){document.querySelector('#dialog-title').textContent=features[current].path;const enlarged=document.querySelector('#dialog-image');const detail=['resume','interview','learning','trace'].includes(features[current].id);enlarged.src='./screenshots/'+features[current].id+(detail?'-detail':'')+'.png';enlarged.alt=image.alt;}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(index));tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=current+1;else if(event.key==='ArrowLeft')target=current-1;else if(event.key==='Home')target=0;else if(event.key==='End')target=features.length-1;else return;event.preventDefault();select(target,true);});});
document.querySelector('#screen-open').addEventListener('click',()=>{updateDialog();dialog.showModal();});
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(current+(event.key==='ArrowRight'?1:-1));}});

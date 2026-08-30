const SUBJECTS=[
  {id:'vocab',label:'어휘',full:'어휘 (Vocabulary)',checked:true},
  {id:'reading',label:'독해',full:'독해 (Reading)',checked:true},
  {id:'writing',label:'쓰기',full:'쓰기 (Writing)',checked:true},
  {id:'grammar',label:'문법',full:'문법 (Grammar)',checked:false},
  {id:'listening',label:'듣기',full:'듣기 (Listening)',checked:false},
  {id:'attendance',label:'출석',full:'출석 (Attendance)',checked:true},
  {id:'homework',label:'과제',full:'과제 (Homework)',checked:true}
];
const state={scores:{},chart:null,db:null,auth:null,user:null,staffProfile:null,isAdmin:false,students:[],teachers:[],staffAccounts:[],selectedStudentId:null,firebaseReady:false,appUnlocked:false};
function el(id){return document.getElementById(id)}
function escapeHtml(str){return String(str).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
function getSchoolType(){return document.querySelector('input[name="schoolType"]:checked').value}
function monthNumber(){return Number(el('evaluationMonth').value.replace('월',''))}
function evaluationKey(){return `${el('evaluationYear').value}-${String(monthNumber()).padStart(2,'0')}`}
function setDbStatus(text,type=''){el('dbStatusText').textContent=text;const b=el('firebaseBadge');b.className='status-badge '+(type==='on'?'on':type==='warn'?'warn':'');}
function renderGrades(preferred=''){
  const select=el('studentLevel'),type=getSchoolType();
  const list=type==='초등부'?['초등 1학년','초등 2학년','초등 3학년','초등 4학년','초등 5학년','초등 6학년']:['중등 1학년','중등 2학년','중등 3학년'];
  select.innerHTML=list.map((x,i)=>`<option ${preferred===x||(!preferred&&type==='초등부'&&i===3)?'selected':''}>${x}</option>`).join('');
}
function renderSubjects(selectedIds=null){
  el('subjectGrid').innerHTML=SUBJECTS.map(s=>`<label class="subject-card"><input type="checkbox" data-subject="${s.id}" ${(selectedIds?selectedIds.includes(s.id):s.checked)?'checked':''}>${s.label}</label>`).join('');
  document.querySelectorAll('[data-subject]').forEach(cb=>cb.addEventListener('change',renderScores));
}
function getSelectedSubjects(){return SUBJECTS.filter(s=>document.querySelector(`[data-subject="${s.id}"]`)?.checked)}
function renderScores(){
  const selected=getSelectedSubjects(),box=el('scoreInputs');
  el('noSubjectWarning').classList.toggle('hidden',selected.length>0);
  box.innerHTML=selected.map(s=>`<div class="score-row"><div class="score-name">[${s.full}] 이번달 점수</div><input class="score-value" data-score="${s.id}" type="number" min="0" max="100" value="${state.scores[s.id]??90}"></div>`).join('');
  document.querySelectorAll('[data-score]').forEach(input=>input.addEventListener('input',e=>{state.scores[e.target.dataset.score]=Math.max(0,Math.min(100,Number(e.target.value||0))) }));
}
function collectScores(){return getSelectedSubjects().map(s=>{const input=document.querySelector(`[data-score="${s.id}"]`);const score=Math.max(0,Math.min(100,Number(input?.value??state.scores[s.id]??90)));state.scores[s.id]=score;return {...s,score}})}

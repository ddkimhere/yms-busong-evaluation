renderGrades();
renderSubjects();
renderScores();
el('evaluationYear').value=new Date().getFullYear();
el('evaluationMonth').value=`${new Date().getMonth()+1}월`;

const YMS_FIREBASE_CONFIG={
  apiKey:'AIzaSyBuXxBX-BffkDQBYL0bDIaQlMkBUC0B3f8',
  authDomain:'yms-ele-evaluation.firebaseapp.com',
  projectId:'yms-ele-evaluation',
  storageBucket:'yms-ele-evaluation.firebasestorage.app',
  messagingSenderId:'578400571836',
  appId:'1:578400571836:web:82ddacfb46f6b52e419bb9'
};

const GROWTH_TESTS={
  'E1-1':{
    stage:'기초 독해 입문',
    areas:'내용 일치 · 주제 · 글의 순서 · 목적 · 요약',
    summary:'짧은 문장과 명확한 정답 근거를 통해 기본적인 독해 이해 능력을 확인하는 입문 단계입니다.',
    meaning:'글 속에서 필요한 정보를 정확하게 찾고, 중심 내용을 파악하는 기초가 안정적으로 형성되어 있는지 확인합니다.'
  },
  'E1-2':{
    stage:'기초 독해 안정',
    areas:'목적 · 심경 · 내용 일치 · 문맥 어휘',
    summary:'지문 길이가 조금 늘어나지만 추론 부담은 낮아, 기초 독해 능력이 안정적으로 자리 잡았는지 확인하는 단계입니다.',
    meaning:'문장 단위 이해를 바탕으로 글의 목적과 분위기, 문맥 속 어휘 의미를 함께 파악하는 능력을 평가합니다.'
  },
  'E1-3':{
    stage:'기초 독해 확장',
    areas:'지시어 · 주장 · 주제 · 글의 순서 · 요약',
    summary:'단순한 정보 찾기에서 한 단계 나아가 글 전체의 중심 내용과 흐름을 파악하는 단계입니다.',
    meaning:'여러 문장을 연결해 글의 핵심을 이해하고, 주제와 주장 및 글의 전개 순서를 판단하는 능력을 평가합니다.'
  },
  'E1-4':{
    stage:'문장 관계 이해',
    areas:'연결어 · 내용 일치 · 글의 순서 · 요약',
    summary:'정보량이 조금 증가하며 연결어와 문장 순서를 통해 문장 사이의 관계를 이해하기 시작하는 단계입니다.',
    meaning:'각 문장을 따로 해석하는 것을 넘어 문장과 문장이 어떻게 이어지는지 파악하는 능력을 확인합니다.'
  },
  'E1-5':{
    stage:'논리 독해 입문',
    areas:'주제 · 심경 · 무관한 문장 · 문장 삽입 · 빈칸 · 요약',
    summary:'무관한 문장, 문장 삽입, 빈칸 등 논리적 흐름을 판단하는 유형이 본격적으로 등장하는 단계입니다.',
    meaning:'글의 전체 흐름을 유지하기 위해 어떤 문장이 필요하고 어떤 내용이 어울리지 않는지 판단하는 논리 독해 능력을 평가합니다.'
  },
  'E1-6':{
    stage:'기초 독해 종합',
    areas:'빈칸 · 무관한 문장 · 글의 순서 · 목적 · 글의 종류',
    summary:'여러 독해 유형을 함께 다루며 학생의 강점과 보완 영역을 보다 구체적으로 확인할 수 있는 종합 단계입니다.',
    meaning:'기초 독해 과정에서 익힌 내용 이해, 중심 내용 파악, 문맥 판단과 논리적 흐름 이해를 종합적으로 평가합니다.'
  },
  'E2-1':{
    stage:'독해 확장 1',
    areas:'내용 이해 · 문맥 · 중심 내용',
    summary:'E1 과정보다 지문 길이와 어휘량이 증가하며 보다 긴 글을 안정적으로 읽는 능력을 확인합니다.',
    meaning:'늘어난 정보량 속에서도 중심 내용과 세부 정보를 놓치지 않고 읽는 독해 지속력을 평가합니다.'
  },
  'E2-2':{
    stage:'문장 연결 판단',
    areas:'지시어 · 문맥 · 내용 이해 · 글의 흐름',
    summary:'직접적인 정보 확인뿐 아니라 문장 사이의 연결 관계를 판단하는 비중이 높아지는 단계입니다.',
    meaning:'지시어와 문맥 단서를 활용해 앞뒤 문장의 관계와 글의 흐름을 파악하는 능력을 평가합니다.'
  },
  'E2-3':{
    stage:'정보성 독해 진입',
    areas:'내용 이해 · 주제 · 문맥 · 추론',
    summary:'정보성 지문이 등장하고 독해량이 늘어나며 내용을 정리하고 추론하는 능력이 요구되는 단계입니다.',
    meaning:'글에 직접 제시된 정보와 문맥 단서를 함께 활용해 핵심 내용을 이해하고 필요한 내용을 추론하는 능력을 평가합니다.'
  },
  'E2-4':{
    stage:'세부 정보 통합',
    areas:'세부 정보 · 대화 문맥 · 연구 내용',
    summary:'필요한 정보가 여러 문장에 나뉘어 제시되기 시작해 세부 내용을 종합하는 능력이 중요해지는 단계입니다.',
    meaning:'한 문장만 보고 답을 찾기보다 여러 정보의 관계를 연결해 정확한 답을 도출하는 능력을 평가합니다.'
  },
  'E2-5':{
    stage:'독해 유형 확장',
    areas:'교훈 · 목적 · 어법 · 글의 순서 · 의미',
    summary:'글 자체의 난도보다 다양한 문제 유형에 적응하고 각각의 출제 의도를 파악하는 능력을 확인하는 단계입니다.',
    meaning:'같은 글을 읽더라도 목적, 교훈, 문장 관계 등 서로 다른 관점에서 내용을 분석할 수 있는지 평가합니다.'
  },
  'E2-6':{
    stage:'학업 성취형 독해',
    areas:'주제 · 내용 이해 · 문맥 · 추론',
    summary:'학교 학업 성취도 평가와 유사하게 중심 내용, 세부 내용, 문맥과 추론을 고르게 확인하는 단계입니다.',
    meaning:'독해의 여러 요소를 균형 있게 사용하여 글을 정확하고 효율적으로 이해하는 능력을 평가합니다.'
  },
  'E3-1':{
    stage:'자료 해석 결합',
    areas:'도표 · 어휘 · 내용 이해 · 논리',
    summary:'일반 독해에 자료 해석이 함께 들어오며 글과 시각 정보를 연결하는 능력을 확인하는 단계입니다.',
    meaning:'문장 정보뿐 아니라 도표나 자료를 함께 읽고 서로 일치하는 정보를 찾아내는 통합적 이해 능력을 평가합니다.'
  },
  'E3-2':{
    stage:'초등 독해 최종',
    areas:'의미 추론 · 무관한 문장 · 글의 순서 · 내용 이해',
    summary:'초등 독해 과정의 최종 단계로, 의미 추론과 논리적 흐름 판단을 포함한 종합 독해 능력을 확인합니다.',
    meaning:'글의 표면적인 내용 이해를 넘어 문맥과 논리를 바탕으로 의미를 추론하고 전체 구조를 파악하는 능력을 평가합니다.'
  }
};
const GROWTH_TEST_ORDER=Object.keys(GROWTH_TESTS);

function installLoginModeUI(){
  const area=el('credentialLoginArea');
  if(!area||el('teacherModeButton'))return;
  const teacherForm=area.innerHTML;
  area.innerHTML=`
    <div class="button-row" style="margin-bottom:14px">
      <button id="teacherModeButton" class="btn" type="button" onclick="showLoginMode('teacher')">👩‍🏫 선생님 로그인</button>
      <button id="adminModeButton" class="btn secondary" type="button" onclick="showLoginMode('admin')">⚙️ 관리자 로그인</button>
    </div>
    <div id="teacherLoginArea">${teacherForm}</div>
    <div id="adminLoginArea" class="hidden">
      <div class="info" style="margin-bottom:12px">관리자 계정으로 로그인하면 선생님 아이디와 비밀번호를 만들고 관리할 수 있습니다.</div>
      <div class="field" style="max-width:420px">
        <label for="adminLoginPassword">관리자 비밀번호</label>
        <input id="adminLoginPassword" type="password" placeholder="Firebase 관리자 비밀번호" autocomplete="current-password" onkeydown="if(event.key==='Enter')loginAdminFirebase()">
      </div>
      <div class="button-row"><button id="adminLoginButton" class="btn" type="button" onclick="loginAdminFirebase()">⚙️ 관리자 로그인</button></div>
    </div>`;
}

function showLoginMode(mode){
  const teacher=el('teacherLoginArea');
  const admin=el('adminLoginArea');
  const teacherBtn=el('teacherModeButton');
  const adminBtn=el('adminModeButton');
  if(!teacher||!admin)return;
  const adminMode=mode==='admin';
  teacher.classList.toggle('hidden',adminMode);
  admin.classList.toggle('hidden',!adminMode);
  if(teacherBtn)teacherBtn.classList.toggle('secondary',adminMode);
  if(adminBtn)adminBtn.classList.toggle('secondary',!adminMode);
  localStorage.setItem('yms_evaluation_login_mode',adminMode?'admin':'teacher');
}

async function loginAdminFirebase(){
  if(!state.auth){alert('Firebase가 아직 연결되지 않았습니다.');return}
  const password=el('adminLoginPassword')?.value||'';
  if(!password){alert('관리자 비밀번호를 입력해 주세요.');return}
  const btn=el('adminLoginButton');
  if(btn)btn.disabled=true;
  setDbStatus('관리자 로그인 중...','warn');
  try{
    await state.auth.signInWithEmailAndPassword(YMS_ADMIN_EMAIL,password);
    if(el('adminLoginPassword'))el('adminLoginPassword').value='';
  }catch(err){
    console.error(err);
    setDbStatus('관리자 로그인 실패: '+firebaseAuthErrorMessage(err),'warn');
    alert(firebaseAuthErrorMessage(err));
  }finally{
    if(btn)btn.disabled=false;
  }
}

function installGrowthTestUI(){
  if(el('growthTestCode'))return;
  const currentBook=el('currentBook');
  if(!currentBook)return;
  const field=currentBook.closest('.field');
  if(!field)return;

  const wrap=document.createElement('div');
  wrap.id='growthTestField';
  wrap.className='field';
  wrap.innerHTML=`
    <label for="growthTestCode">Growth Test 시험코드</label>
    <select id="growthTestCode" onchange="renderGrowthTestPreview()">
      <option value="">선택 안 함</option>
      ${GROWTH_TEST_ORDER.map(code=>`<option value="${code}">${code} · ${GROWTH_TESTS[code].stage}</option>`).join('')}
    </select>
    <div id="growthTestPreview" class="growth-preview-mini">시험코드를 선택하면 시험의 평가 성격이 표시됩니다.</div>`;
  field.insertAdjacentElement('afterend',wrap);

  document.querySelectorAll('input[name="schoolType"]').forEach(radio=>radio.addEventListener('change',toggleGrowthTestField));
  toggleGrowthTestField();

  const style=document.createElement('style');
  style.textContent=`
    .growth-preview-mini{margin-top:8px;padding:10px 12px;border-radius:10px;background:#f5f8ff;color:#4c5870;font-size:13px;line-height:1.55}
    .growth-report{margin:20px 0 24px;padding:20px;border:1px solid #dfe6f3;border-radius:16px;background:linear-gradient(180deg,#f8faff 0%,#ffffff 100%)}
    .growth-report-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
    .growth-code{font-weight:800;font-size:20px;color:#173b70}.growth-stage{padding:5px 10px;border-radius:999px;background:#e8f0ff;color:#24518e;font-weight:700;font-size:13px}
    .growth-label{font-size:12px;color:#667085;font-weight:700;margin-top:12px;margin-bottom:4px}.growth-text{font-size:14px;line-height:1.65;color:#28354a}
    .growth-progress{display:flex;gap:5px;flex-wrap:wrap;margin-top:14px}.growth-step{font-size:11px;padding:4px 7px;border-radius:999px;background:#eef1f5;color:#7a8494}.growth-step.current{background:#173b70;color:white;font-weight:800}
    @media(max-width:600px){.growth-report{padding:16px}.growth-step{font-size:10px;padding:4px 6px}}
  `;
  document.head.appendChild(style);
}

function toggleGrowthTestField(){
  const field=el('growthTestField');
  if(!field)return;
  const elementary=getSchoolType()==='초등부';
  field.classList.toggle('hidden',!elementary);
  if(!elementary&&el('growthTestCode'))el('growthTestCode').value='';
  renderGrowthTestPreview();
}

function renderGrowthTestPreview(){
  const box=el('growthTestPreview');
  const code=el('growthTestCode')?.value||'';
  if(!box)return;
  const meta=GROWTH_TESTS[code];
  if(!meta){box.textContent='시험코드를 선택하면 시험의 평가 성격이 표시됩니다.';return}
  box.innerHTML=`<strong>${escapeHtml(code)} · ${escapeHtml(meta.stage)}</strong><br>${escapeHtml(meta.summary)}`;
}

function growthReportHtml(code){
  const meta=GROWTH_TESTS[code];
  if(!meta)return '';
  return `<div class="growth-report">
    <div class="growth-report-head"><span class="growth-code">📘 ${escapeHtml(code)}</span><span class="growth-stage">${escapeHtml(meta.stage)}</span></div>
    <div class="growth-label">이번 Growth Test는 어떤 시험인가요?</div>
    <div class="growth-text">${escapeHtml(meta.summary)}</div>
    <div class="growth-label">주요 평가 영역</div>
    <div class="growth-text"><strong>${escapeHtml(meta.areas)}</strong></div>
    <div class="growth-label">이번 시험의 의미</div>
    <div class="growth-text">${escapeHtml(meta.meaning)}</div>
    <div class="growth-progress">${GROWTH_TEST_ORDER.map(c=>`<span class="growth-step ${c===code?'current':''}">${escapeHtml(c)}</span>`).join('')}</div>
  </div>`;
}

function installGrowthReportBlock(){
  if(el('growthTestReportBlock'))return;
  const studentStrip=el('studentStrip');
  if(!studentStrip)return;
  const block=document.createElement('div');
  block.id='growthTestReportBlock';
  studentStrip.insertAdjacentElement('afterend',block);
}

function renderGrowthReportBlock(){
  const block=el('growthTestReportBlock');
  if(!block)return;
  const code=getSchoolType()==='초등부'?(el('growthTestCode')?.value||''):'';
  block.innerHTML=growthReportHtml(code);
}

function installEvaluationWrappers(){
  if(window.__growthWrappersInstalled)return;
  window.__growthWrappersInstalled=true;

  const originalSave=window.saveEvaluation;
  if(typeof originalSave==='function'){
    window.saveEvaluation=async function(){
      await originalSave();
      const savedOk=el('saveStatus')?.textContent?.includes('저장되었습니다');
      if(!savedOk||!state.db||!state.selectedStudentId||!state.user||!state.appUnlocked)return;
      const code=getSchoolType()==='초등부'?(el('growthTestCode')?.value||''):'';
      try{
        await state.db.collection('students').doc(state.selectedStudentId).collection('evaluations').doc(evaluationKey()).set({growthTestCode:code},{merge:true});
      }catch(err){console.error('Growth Test 코드 저장 실패:',err)}
    };
  }

  const originalLoad=window.loadSelectedEvaluation;
  if(typeof originalLoad==='function'){
    window.loadSelectedEvaluation=async function(){
      const sid=state.selectedStudentId;
      const key=el('evaluationHistory')?.value||'';
      await originalLoad();
      if(!sid||!key||!state.db||!el('growthTestCode'))return;
      try{
        const doc=await state.db.collection('students').doc(sid).collection('evaluations').doc(key).get();
        if(doc.exists){
          el('growthTestCode').value=doc.data().growthTestCode||'';
          renderGrowthTestPreview();
        }
      }catch(err){console.error('Growth Test 코드 불러오기 실패:',err)}
    };
  }

  const originalClear=window.clearStudentForm;
  if(typeof originalClear==='function'){
    window.clearStudentForm=function(){
      originalClear();
      if(el('growthTestCode'))el('growthTestCode').value='';
      renderGrowthTestPreview();
    };
  }
}

function scoreLevel(score){
  if(score>=90)return '매우 우수';
  if(score>=80)return '우수';
  if(score>=70)return '양호';
  if(score>=60)return '보완 필요';
  return '집중 보완';
}

window.generateReport=function(){
  const rows=collectScores();
  if(!rows.length){
    el('reportError').classList.remove('hidden');
    return;
  }
  el('reportError').classList.add('hidden');
  el('result-section').classList.remove('hidden');

  el('reportMonth').textContent=`${el('evaluationYear').value}년 ${monthNumber()}월 정기 평가`;
  el('studentStrip').innerHTML=`
    <div><strong>${escapeHtml(el('studentName').value.trim()||'학생')}</strong></div>
    <div>${escapeHtml(el('studentLevel').value||'')} · ${escapeHtml(el('currentBook').value.trim()||'교재 미입력')}</div>
    <div>담임 ${escapeHtml(el('teacherName').value.trim()||'미지정')}</div>`;

  renderGrowthReportBlock();

  el('reportTableBody').innerHTML=rows.map(r=>`<tr><td>${escapeHtml(r.full)}</td><td><strong>${r.score}점</strong> · ${scoreLevel(r.score)}</td></tr>`).join('');
  el('reportFeedback').textContent=el('teacherFeedback').value.trim()||'담임선생님 종합 의견이 입력되지 않았습니다.';

  if(state.chart){try{state.chart.destroy()}catch(_){}}
  const canvas=el('scoreChart');
  if(canvas&&window.Chart){
    state.chart=new Chart(canvas.getContext('2d'),{
      type:'bar',
      data:{labels:rows.map(r=>r.label),datasets:[{label:'이번달 점수',data:rows.map(r=>r.score)}]},
      options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100,ticks:{stepSize:20}}},plugins:{legend:{display:false}}}
    });
  }
  setTimeout(()=>el('result-section').scrollIntoView({behavior:'smooth',block:'start'}),50);
};

async function downloadEvaluationPng(){
  const area=el('capture-area');
  if(!area||!window.html2canvas){alert('이미지 저장 기능을 불러오지 못했습니다.');return}
  const btn=el('downloadButton');
  if(btn)btn.disabled=true;
  try{
    const canvas=await html2canvas(area,{scale:2,useCORS:true,backgroundColor:'#ffffff'});
    const link=document.createElement('a');
    const safeName=(el('studentName').value.trim()||'학생').replace(/[\\/:*?"<>|]/g,'_');
    link.download=`${safeName}_${evaluationKey()}_Evaluation.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
  }catch(err){
    console.error(err);
    alert('결과지 이미지 저장에 실패했습니다: '+(err.message||err));
  }finally{
    if(btn)btn.disabled=false;
  }
}

installLoginModeUI();
installGrowthTestUI();
installGrowthReportBlock();
installEvaluationWrappers();
if(el('downloadButton'))el('downloadButton').onclick=downloadEvaluationPng;
const savedLoginMode=localStorage.getItem('yms_evaluation_login_mode')||'teacher';
showLoginMode(savedLoginMode==='admin'?'admin':'teacher');
localStorage.setItem('yms_evaluation_firebase_config',JSON.stringify(YMS_FIREBASE_CONFIG));
initFirebaseFromSaved();

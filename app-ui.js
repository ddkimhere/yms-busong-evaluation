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

installLoginModeUI();
const savedLoginMode=localStorage.getItem('yms_evaluation_login_mode')||'teacher';
showLoginMode(savedLoginMode==='admin'?'admin':'teacher');
localStorage.setItem('yms_evaluation_firebase_config',JSON.stringify(YMS_FIREBASE_CONFIG));
initFirebaseFromSaved();

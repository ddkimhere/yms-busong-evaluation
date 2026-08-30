const YMS_ADMIN_EMAIL='ddkim1984@gmail.com';
const YMS_STAFF_LOGIN_DOMAIN='yms-ele-evaluation.firebaseapp.com';

async function initFirebaseFromSaved(){
  const saved=localStorage.getItem('yms_evaluation_firebase_config') || JSON.stringify(YMS_FIREBASE_CONFIG);
  localStorage.setItem('yms_evaluation_firebase_config',saved);
  el('firebaseConfigInput').value=JSON.stringify(JSON.parse(saved),null,2);
  await connectFirebase(false);
}

function normalizeLoginId(value){
  const clean=String(value||'').trim().toLowerCase();
  if(clean.includes('@'))return clean;
  if(!/^[a-z0-9._-]{2,32}$/.test(clean))throw new Error('아이디는 영문 소문자, 숫자, 점(.), 밑줄(_), 하이픈(-)으로 2~32자만 사용할 수 있습니다.');
  return clean;
}

function loginIdToEmail(value){
  const clean=normalizeLoginId(value);
  return clean.includes('@')?clean:`${clean}@${YMS_STAFF_LOGIN_DOMAIN}`;
}

function currentActor(){
  if(state.isAdmin)return '관리자';
  return state.staffProfile?.name||state.staffProfile?.loginId||state.user?.uid||'';
}

async function connectFirebase(showMessage=true){
  try{
    const raw=el('firebaseConfigInput').value.trim();
    if(!raw)throw new Error('Firebase 설정 JSON을 입력해 주세요.');
    const config=JSON.parse(raw);
    if(!config.apiKey||!config.projectId)throw new Error('apiKey와 projectId가 포함된 firebaseConfig가 필요합니다.');

    if(window.ymsAuthUnsubscribe){
      window.ymsAuthUnsubscribe();
      window.ymsAuthUnsubscribe=null;
    }
    if(firebase.apps.length){
      await Promise.all(firebase.apps.map(app=>app.name==='[DEFAULT]'?app.delete().catch(()=>{}):Promise.resolve()));
    }

    firebase.initializeApp(config);
    state.auth=firebase.auth();
    state.db=firebase.firestore();
    state.user=null;
    state.staffProfile=null;
    state.isAdmin=false;
    state.appUnlocked=false;
    state.firebaseReady=true;

    await state.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    localStorage.setItem('yms_evaluation_firebase_config',JSON.stringify(config));
    el('firebaseConfigInput').value=JSON.stringify(config,null,2);
    el('authArea').classList.remove('hidden');
    updateAuthUI();
    setDbStatus('Firebase 연결됨 · 로그인이 필요합니다.','warn');

    window.ymsAuthUnsubscribe=state.auth.onAuthStateChanged(async user=>{
      state.user=user||null;
      state.staffProfile=null;
      state.isAdmin=false;
      state.appUnlocked=false;

      if(!user){
        clearLoadedDbState();
        updateAuthUI();
        setDbStatus('Firebase 연결됨 · 아이디와 비밀번호로 로그인해 주세요.','warn');
        return;
      }

      try{
        state.isAdmin=(user.email||'').toLowerCase()===YMS_ADMIN_EMAIL.toLowerCase();
        if(state.isAdmin){
          state.staffProfile={name:'관리자',loginId:'admin',role:'admin',active:true};
          state.appUnlocked=true;
          updateAuthUI();
          setDbStatus('Firebase 연결됨 · 관리자 로그인','on');
          await Promise.all([loadTeachers(),loadStudents(),loadStaffAccounts()]);
          return;
        }

        const staffDoc=await state.db.collection('staff').doc(user.uid).get();
        if(!staffDoc.exists||staffDoc.data().active===false){
          clearLoadedDbState();
          updateAuthUI();
          setDbStatus('등록되지 않았거나 사용 중지된 선생님 계정입니다.','warn');
          await state.auth.signOut();
          return;
        }

        state.staffProfile={id:staffDoc.id,...staffDoc.data()};
        state.appUnlocked=true;
        updateAuthUI();
        setDbStatus(`Firebase 연결됨 · ${state.staffProfile.name||state.staffProfile.loginId||'선생님'} 로그인`,'on');
        await Promise.all([loadTeachers(),loadStudents()]);
      }catch(err){
        console.error(err);
        clearLoadedDbState();
        updateAuthUI();
        if(err&&err.code==='permission-denied'){
          setDbStatus('Firestore 보안 규칙을 먼저 게시해 주세요.','warn');
        }else{
          setDbStatus('계정 확인 실패: '+(err.message||String(err)),'warn');
        }
      }
    });

    if(showMessage)setDbStatus('Firebase 연결됨 · 로그인이 필요합니다.','warn');
  }catch(err){
    state.firebaseReady=false;
    state.auth=null;
    state.db=null;
    state.user=null;
    state.staffProfile=null;
    state.isAdmin=false;
    state.appUnlocked=false;
    updateAuthUI();
    setDbStatus('Firebase 연결 실패: '+(err.message||String(err)),'');
    if(showMessage)alert('Firebase 연결 오류: '+(err.message||String(err)));
    else console.error('Firebase 연결 오류:',err);
  }
}

function resetFirebaseConfig(){
  localStorage.removeItem('yms_evaluation_firebase_config');
  el('firebaseConfigInput').value='';
  location.reload();
}

function clearLoadedDbState(){
  state.students=[];
  state.teachers=[];
  state.staffAccounts=[];
  state.selectedStudentId=null;
  if(el('studentPicker'))el('studentPicker').innerHTML='<option value="">로그인 후 학생 목록을 불러옵니다</option>';
  if(el('teacherOptions'))el('teacherOptions').innerHTML='';
  if(el('evaluationHistory'))el('evaluationHistory').innerHTML='<option value="">저장된 평가가 없습니다</option>';
  if(el('staffAccountList'))el('staffAccountList').innerHTML='';
}

function updateAuthUI(){
  const authArea=el('authArea');
  const credentialArea=el('credentialLoginArea');
  const loginButton=el('loginButton');
  const logoutButton=el('logoutButton');
  const loginIdInput=el('loginId');
  const passwordInput=el('loginPassword');
  const userText=el('loginUserText');
  const adminPanel=el('adminAccountPanel');
  const firebaseSettings=el('firebaseSettingsDetails');

  if(!state.firebaseReady){
    authArea.classList.add('hidden');
    if(userText)userText.textContent='';
    return;
  }

  authArea.classList.remove('hidden');
  const signedIn=!!state.user&&state.appUnlocked;
  credentialArea.classList.toggle('hidden',signedIn);
  logoutButton.classList.toggle('hidden',!signedIn);
  if(loginIdInput)loginIdInput.disabled=signedIn;
  if(passwordInput)passwordInput.disabled=signedIn;
  if(loginButton)loginButton.disabled=signedIn;
  if(adminPanel)adminPanel.classList.toggle('hidden',!(signedIn&&state.isAdmin));
  if(firebaseSettings)firebaseSettings.classList.toggle('hidden',signedIn&&!state.isAdmin);

  if(!signedIn){
    userText.textContent='관리자에게 받은 아이디와 비밀번호로 로그인해 주세요.';
    return;
  }

  if(passwordInput)passwordInput.value='';
  userText.textContent=state.isAdmin?'관리자 로그인':`로그인: ${state.staffProfile?.name||state.staffProfile?.loginId||'선생님'}`;
}

async function loginFirebase(){
  if(!state.auth){alert('Firebase가 아직 연결되지 않았습니다.');return}
  const loginId=el('loginId').value.trim();
  const password=el('loginPassword').value;
  if(!loginId||!password){alert('아이디와 비밀번호를 입력해 주세요.');return}

  const btn=el('loginButton');
  btn.disabled=true;
  setDbStatus('로그인 중...','warn');
  try{
    const email=loginIdToEmail(loginId);
    await state.auth.signInWithEmailAndPassword(email,password);
  }catch(err){
    console.error(err);
    setDbStatus('로그인 실패: '+firebaseAuthErrorMessage(err),'warn');
    alert(firebaseAuthErrorMessage(err));
  }finally{
    btn.disabled=false;
  }
}

async function logoutFirebase(){
  if(!state.auth)return;
  state.staffProfile=null;
  state.isAdmin=false;
  state.appUnlocked=false;
  await state.auth.signOut();
}

function firebaseAuthErrorMessage(err){
  const code=err&&err.code?err.code:'';
  const messages={
    'auth/invalid-email':'아이디 형식이 올바르지 않습니다.',
    'auth/invalid-credential':'아이디 또는 비밀번호가 올바르지 않습니다.',
    'auth/user-not-found':'아이디 또는 비밀번호가 올바르지 않습니다.',
    'auth/wrong-password':'아이디 또는 비밀번호가 올바르지 않습니다.',
    'auth/user-disabled':'사용 중지된 계정입니다.',
    'auth/email-already-in-use':'이미 사용 중인 아이디입니다.',
    'auth/weak-password':'비밀번호는 6자 이상으로 정해 주세요.',
    'auth/too-many-requests':'로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    'auth/operation-not-allowed':'Firebase Authentication에서 이메일/비밀번호 로그인을 활성화해야 합니다.'
  };
  return messages[code]||(err&&err.message?err.message:'Firebase 인증에 실패했습니다.');
}

function requireDb(){
  if(!state.firebaseReady||!state.db){
    alert('Firebase 데이터베이스가 아직 연결되지 않았습니다.');
    return false;
  }
  if(!state.user||!state.appUnlocked){
    alert('먼저 선생님 계정으로 로그인해 주세요.');
    return false;
  }
  return true;
}

async function loadStaffAccounts(){
  if(!state.db||!state.user||!state.isAdmin||!state.appUnlocked)return;
  try{
    const snap=await state.db.collection('staff').get();
    state.staffAccounts=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.name||'').localeCompare(b.name||'','ko'));
    renderStaffAccounts();
  }catch(err){
    console.error(err);
    if(el('staffAccountList'))el('staffAccountList').innerHTML=`<div class="warning">선생님 계정 목록을 불러오지 못했습니다: ${escapeHtml(err.message||String(err))}</div>`;
  }
}

function renderStaffAccounts(){
  const box=el('staffAccountList');
  if(!box)return;
  if(!state.staffAccounts.length){
    box.innerHTML='<div class="mini">아직 등록된 선생님 계정이 없습니다.</div>';
    return;
  }
  box.innerHTML=`<div style="overflow-x:auto"><table class="score-table"><thead><tr><td>선생님</td><td>아이디</td><td>상태</td><td>관리</td></tr></thead><tbody>${state.staffAccounts.map(s=>`<tr><td>${escapeHtml(s.name||'')}</td><td>${escapeHtml(s.loginId||'')}</td><td>${s.active===false?'사용 중지':'사용 중'}</td><td><button class="btn secondary" type="button" style="padding:7px 10px" onclick="toggleStaffActive('${s.id}',${s.active===false?'true':'false'})">${s.active===false?'사용 재개':'사용 중지'}</button></td></tr>`).join('')}</tbody></table></div>`;
}

async function createStaffAccount(){
  if(!state.isAdmin||!state.user){alert('관리자만 선생님 계정을 만들 수 있습니다.');return}
  const name=el('newStaffName').value.trim();
  const rawId=el('newStaffId').value.trim();
  const password=el('newStaffPassword').value;
  if(!name){alert('선생님 이름을 입력해 주세요.');return}
  if(!rawId){alert('로그인 아이디를 입력해 주세요.');return}
  if(password.length<6){alert('비밀번호는 6자 이상으로 정해 주세요.');return}

  let loginId;
  let email;
  try{
    loginId=normalizeLoginId(rawId);
    if(loginId.includes('@'))throw new Error('선생님 로그인 아이디에는 @를 사용할 수 없습니다.');
    email=loginIdToEmail(loginId);
  }catch(err){
    alert(err.message||String(err));
    return;
  }

  const btn=el('createStaffButton');
  const status=el('staffCreateStatus');
  btn.disabled=true;
  status.textContent='선생님 계정을 만들고 있습니다...';
  let secondaryApp=null;
  let secondaryAuth=null;
  let createdUser=null;

  try{
    const duplicate=await state.db.collection('staff').where('loginId','==',loginId).limit(1).get();
    if(!duplicate.empty)throw new Error('이미 사용 중인 아이디입니다.');

    const secondaryName=`staffCreator-${Date.now()}`;
    secondaryApp=firebase.initializeApp(firebase.app().options,secondaryName);
    secondaryAuth=secondaryApp.auth();
    const cred=await secondaryAuth.createUserWithEmailAndPassword(email,password);
    createdUser=cred.user;

    await state.db.collection('staff').doc(createdUser.uid).set({
      name,
      loginId,
      authEmail:email,
      role:'teacher',
      active:true,
      createdBy:YMS_ADMIN_EMAIL,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    });

    const teacherExists=state.teachers.some(t=>(t.name||'').trim()===name);
    if(!teacherExists){
      await state.db.collection('teachers').add({name,active:true,createdBy:'관리자',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    }

    status.innerHTML=`<span style="color:var(--green)">✓ ${escapeHtml(name)} 선생님 계정 생성 완료 · 아이디: ${escapeHtml(loginId)}</span>`;
    el('newStaffName').value='';
    el('newStaffId').value='';
    el('newStaffPassword').value='';
    await Promise.all([loadStaffAccounts(),loadTeachers()]);
  }catch(err){
    console.error(err);
    if(createdUser){
      try{await createdUser.delete()}catch(_){ }
    }
    status.innerHTML=`<span style="color:var(--red)">⚠️ 계정 생성 실패: ${escapeHtml(firebaseAuthErrorMessage(err))}</span>`;
  }finally{
    if(secondaryAuth){try{await secondaryAuth.signOut()}catch(_){ }}
    if(secondaryApp){try{await secondaryApp.delete()}catch(_){ }}
    btn.disabled=false;
  }
}

async function toggleStaffActive(uid,nextActive){
  if(!state.isAdmin||!state.user)return;
  try{
    await state.db.collection('staff').doc(uid).set({active:!!nextActive,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    await loadStaffAccounts();
  }catch(err){
    alert('계정 상태 변경 실패: '+(err.message||err));
  }
}

async function loadTeachers(){
  if(!state.db||!state.user||!state.appUnlocked)return;
  try{
    const snap=await state.db.collection('teachers').get();
    state.teachers=snap.docs
      .map(d=>({id:d.id,...d.data()}))
      .filter(x=>x.active!==false)
      .sort((a,b)=>(a.name||'').localeCompare(b.name||'','ko'));
    el('teacherOptions').innerHTML=state.teachers.map(t=>`<option value="${escapeHtml(t.name||'')}"></option>`).join('');
  }catch(err){
    console.error(err);
    if(err&&err.code==='permission-denied')setDbStatus('로그인은 되었지만 Firestore 보안 규칙이 아직 허용되지 않았습니다.','warn');
  }
}

async function ensureTeacher(name){
  const clean=name.trim();
  if(!clean)return;
  const exists=state.teachers.some(t=>(t.name||'').trim()===clean);
  if(exists)return;
  await state.db.collection('teachers').add({
    name:clean,
    active:true,
    createdBy:currentActor(),
    createdAt:firebase.firestore.FieldValue.serverTimestamp()
  });
  await loadTeachers();
}

async function loadStudents(){
  if(!state.db||!state.user||!state.appUnlocked)return;
  try{
    const snap=await state.db.collection('students').get();
    state.students=snap.docs
      .map(d=>({id:d.id,...d.data()}))
      .sort((a,b)=>(a.name||'').localeCompare(b.name||'','ko'));
    const picker=el('studentPicker');
    const current=state.selectedStudentId||'';
    picker.innerHTML='<option value="">새 학생 입력</option>'+state.students.map(s=>`<option value="${s.id}">${escapeHtml(s.name||'(이름 없음)')} · ${escapeHtml(s.studentLevel||'')}</option>`).join('');
    picker.value=state.students.some(s=>s.id===current)?current:'';
  }catch(err){
    console.error(err);
    if(err&&err.code==='permission-denied'){
      setDbStatus('로그인은 되었지만 Firestore 보안 규칙에서 읽기/쓰기가 허용되지 않았습니다.','warn');
    }else{
      alert('학생 목록 불러오기 실패: '+(err.message||err));
    }
  }
}

function clearStudentForm(){
  state.selectedStudentId=null;
  el('studentPicker').value='';
  el('studentName').value='';
  el('teacherName').value='';
  el('currentBook').value='';
  document.querySelector('input[name="schoolType"][value="초등부"]').checked=true;
  renderGrades();
  state.scores={};
  renderSubjects();
  renderScores();
  el('evaluationHistory').innerHTML='<option value="">저장된 평가가 없습니다</option>';
  el('customPos').value='';
  el('customNeg').value='';
  el('teacherFeedback').value='';
  el('saveStatus').textContent='새 학생 입력 모드입니다.';
}

async function selectStudent(id){
  if(!id){clearStudentForm();return}
  const s=state.students.find(x=>x.id===id);
  if(!s)return;
  state.selectedStudentId=id;
  el('studentName').value=s.name||'';
  el('teacherName').value=s.teacherName||'';
  el('currentBook').value=s.currentBook||'';
  const radio=document.querySelector(`input[name="schoolType"][value="${s.schoolType||'초등부'}"]`);
  if(radio)radio.checked=true;
  renderGrades(s.studentLevel||'');
  await loadEvaluationHistory(id);
  el('saveStatus').textContent=`${s.name||'학생'} 학생을 불러왔습니다.`;
}

async function saveStudent(){
  const name=el('studentName').value.trim();
  if(!name)throw new Error('학생 이름을 입력해 주세요.');
  const teacherName=el('teacherName').value.trim();
  await ensureTeacher(teacherName);
  const data={
    name,
    teacherName,
    schoolType:getSchoolType(),
    studentLevel:el('studentLevel').value,
    currentBook:el('currentBook').value.trim(),
    updatedBy:currentActor(),
    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
  };
  if(state.selectedStudentId){
    await state.db.collection('students').doc(state.selectedStudentId).set(data,{merge:true});
    return state.selectedStudentId;
  }
  const ref=await state.db.collection('students').add({
    ...data,
    createdBy:currentActor(),
    createdAt:firebase.firestore.FieldValue.serverTimestamp()
  });
  state.selectedStudentId=ref.id;
  return ref.id;
}

async function saveEvaluation(){
  if(!requireDb())return;
  const rows=collectScores();
  if(!rows.length){alert('평가 영역을 하나 이상 선택해 주세요.');return}
  const btn=el('saveEvaluationButton');
  btn.disabled=true;
  el('saveStatus').innerHTML='<span class="spinner"></span>학생정보와 평가를 저장하고 있습니다...';
  try{
    const studentId=await saveStudent();
    const scores={};
    rows.forEach(r=>scores[r.id]=r.score);
    const key=evaluationKey();
    await state.db.collection('students').doc(studentId).collection('evaluations').doc(key).set({
      evaluationKey:key,
      year:Number(el('evaluationYear').value),
      month:monthNumber(),
      selectedSubjects:rows.map(r=>r.id),
      scores,
      teacherName:el('teacherName').value.trim(),
      strengths:el('customPos').value.trim(),
      improvements:el('customNeg').value.trim(),
      feedback:el('teacherFeedback').value.trim(),
      updatedBy:currentActor(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    await loadStudents();
    el('studentPicker').value=studentId;
    await loadEvaluationHistory(studentId);
    el('evaluationHistory').value=key;
    el('saveStatus').innerHTML=`<span style="color:var(--green)">✓ ${escapeHtml(el('studentName').value)} · ${key} 평가가 저장되었습니다.</span>`;
  }catch(err){
    console.error(err);
    el('saveStatus').innerHTML=`<span style="color:var(--red)">⚠️ 저장 실패: ${escapeHtml(err.message||String(err))}</span>`;
  }finally{
    btn.disabled=false;
  }
}

async function loadEvaluationHistory(studentId=state.selectedStudentId){
  if(!studentId||!state.db||!state.user||!state.appUnlocked){
    el('evaluationHistory').innerHTML='<option value="">저장된 평가가 없습니다</option>';
    return;
  }
  try{
    const snap=await state.db.collection('students').doc(studentId).collection('evaluations').get();
    const items=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.id.localeCompare(a.id));
    el('evaluationHistory').innerHTML=items.length
      ?'<option value="">평가 선택</option>'+items.map(x=>`<option value="${x.id}">${x.id} · ${escapeHtml(x.teacherName||'담임 미지정')}</option>`).join('')
      :'<option value="">저장된 평가가 없습니다</option>';
  }catch(err){
    console.error(err);
  }
}

async function loadSelectedEvaluation(){
  if(!requireDb())return;
  const sid=state.selectedStudentId;
  const key=el('evaluationHistory').value;
  if(!sid){alert('먼저 등록 학생을 선택해 주세요.');return}
  if(!key){alert('불러올 평가월을 선택해 주세요.');return}
  try{
    const doc=await state.db.collection('students').doc(sid).collection('evaluations').doc(key).get();
    if(!doc.exists)throw new Error('평가 기록이 없습니다.');
    const d=doc.data();
    el('evaluationYear').value=d.year||Number(key.slice(0,4));
    el('evaluationMonth').value=`${d.month||Number(key.slice(5,7))}월`;
    state.scores={...(d.scores||{})};
    renderSubjects(d.selectedSubjects||Object.keys(d.scores||{}));
    renderScores();
    el('teacherName').value=d.teacherName||el('teacherName').value;
    el('customPos').value=d.strengths||'';
    el('customNeg').value=d.improvements||'';
    el('teacherFeedback').value=d.feedback||'';
    el('saveStatus').textContent=`${key} 평가를 불러왔습니다.`;
  }catch(err){
    alert('평가 불러오기 실패: '+(err.message||err));
  }
}

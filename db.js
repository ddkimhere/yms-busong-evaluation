async function initFirebaseFromSaved(){
  const saved=localStorage.getItem('yms_evaluation_firebase_config') || JSON.stringify(YMS_FIREBASE_CONFIG);
  localStorage.setItem('yms_evaluation_firebase_config',saved);
  el('firebaseConfigInput').value=JSON.stringify(JSON.parse(saved),null,2);
  await connectFirebase(false);
}

function pinStorageKey(user=state.user){
  return user&&user.uid?`yms_evaluation_pin_${user.uid}`:'';
}

function getStoredPinHash(user=state.user){
  const key=pinStorageKey(user);
  return key?localStorage.getItem(key):null;
}

async function hashPin(pin,user=state.user){
  if(!user||!user.uid)throw new Error('로그인 정보가 없습니다.');
  const data=new TextEncoder().encode(`${user.uid}:${pin}`);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
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
      await Promise.all(firebase.apps.map(app=>app.delete().catch(()=>{})));
    }

    firebase.initializeApp(config);
    state.auth=firebase.auth();
    state.db=firebase.firestore();
    state.user=null;
    state.appUnlocked=false;
    state.firebaseReady=true;

    await state.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    localStorage.setItem('yms_evaluation_firebase_config',JSON.stringify(config));
    el('firebaseConfigInput').value=JSON.stringify(config,null,2);
    el('authArea').classList.remove('hidden');
    updateAuthUI();
    setDbStatus('Firebase 연결됨 · 선생님 인증이 필요합니다.','warn');

    window.ymsAuthUnsubscribe=state.auth.onAuthStateChanged(async user=>{
      state.user=user||null;
      state.appUnlocked=false;

      if(user){
        const hasPin=!!getStoredPinHash(user);
        setDbStatus(hasPin
          ?'Firebase 연결됨 · 휴대폰 뒷 4자리를 입력해 주세요.'
          :'Firebase 연결됨 · 이 기기에서 사용할 휴대폰 뒷 4자리를 설정해 주세요.','warn');
      }else{
        clearLoadedDbState();
        setDbStatus('Firebase 연결됨 · 새 기기에서는 최초 1회 계정 로그인이 필요합니다.','warn');
      }
      updateAuthUI();
    });

    if(showMessage)setDbStatus('Firebase 연결됨 · 선생님 인증이 필요합니다.','warn');
  }catch(err){
    state.firebaseReady=false;
    state.auth=null;
    state.db=null;
    state.user=null;
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
  state.selectedStudentId=null;
  if(el('studentPicker'))el('studentPicker').innerHTML='<option value="">로그인 후 학생 목록을 불러옵니다</option>';
  if(el('teacherOptions'))el('teacherOptions').innerHTML='';
  if(el('evaluationHistory'))el('evaluationHistory').innerHTML='<option value="">저장된 평가가 없습니다</option>';
}

function updateAuthUI(){
  const authArea=el('authArea');
  const credentialArea=el('credentialLoginArea');
  const pinArea=el('pinArea');
  const loginButton=el('loginButton');
  const logoutButton=el('logoutButton');
  const lockButton=el('lockButton');
  const emailInput=el('loginEmail');
  const passwordInput=el('loginPassword');
  const pinInput=el('pinInput');
  const pinActionButton=el('pinActionButton');
  const pinHelpText=el('pinHelpText');
  const userText=el('loginUserText');

  if(!state.firebaseReady){
    authArea.classList.add('hidden');
    userText.textContent='';
    return;
  }

  authArea.classList.remove('hidden');
  const signedIn=!!state.user;

  if(!signedIn){
    credentialArea.classList.remove('hidden');
    pinArea.classList.add('hidden');
    logoutButton.classList.add('hidden');
    lockButton.classList.add('hidden');
    emailInput.disabled=false;
    passwordInput.disabled=false;
    loginButton.disabled=false;
    userText.textContent='새 기기에서는 최초 1회 Firebase 계정으로 로그인해 주세요.';
    return;
  }

  credentialArea.classList.add('hidden');
  logoutButton.classList.remove('hidden');

  if(state.appUnlocked){
    pinArea.classList.add('hidden');
    lockButton.classList.remove('hidden');
    userText.textContent=`사용 중: ${state.user.email||'선생님 계정'}`;
    return;
  }

  lockButton.classList.add('hidden');
  pinArea.classList.remove('hidden');
  if(pinInput)pinInput.value='';
  const hasPin=!!getStoredPinHash();
  if(hasPin){
    pinActionButton.textContent='🔓 뒷 4자리로 열기';
    pinHelpText.textContent='이 휴대폰에 등록한 휴대폰 번호 뒷 4자리를 입력하세요.';
  }else{
    pinActionButton.textContent='📱 뒷 4자리 등록 · 시작';
    pinHelpText.textContent='최초 1회만 휴대폰 번호 뒷 4자리를 등록하면 다음부터는 이 4자리만 입력하면 됩니다.';
  }
  userText.textContent=`인증 계정: ${state.user.email||'선생님 계정'}`;
}

async function loginFirebase(){
  if(!state.auth){alert('Firebase가 아직 연결되지 않았습니다.');return}
  const email=el('loginEmail').value.trim();
  const password=el('loginPassword').value;
  if(!email||!password){alert('로그인 이메일과 비밀번호를 입력해 주세요.');return}

  const btn=el('loginButton');
  btn.disabled=true;
  setDbStatus('Firebase 로그인 중...','warn');
  try{
    await state.auth.signInWithEmailAndPassword(email,password);
  }catch(err){
    console.error(err);
    setDbStatus('로그인 실패: '+firebaseAuthErrorMessage(err),'warn');
    alert(firebaseAuthErrorMessage(err));
  }finally{
    btn.disabled=false;
  }
}

async function handlePinAction(){
  if(!state.user){alert('먼저 선생님 계정으로 로그인해 주세요.');return}
  const pin=el('pinInput').value.trim();
  if(!/^\d{4}$/.test(pin)){
    alert('휴대폰 번호 뒷 4자리를 숫자 4자리로 입력해 주세요.');
    return;
  }

  const btn=el('pinActionButton');
  btn.disabled=true;
  try{
    const enteredHash=await hashPin(pin);
    const storedHash=getStoredPinHash();
    if(!storedHash){
      localStorage.setItem(pinStorageKey(),enteredHash);
    }else if(storedHash!==enteredHash){
      alert('휴대폰 번호 뒷 4자리가 맞지 않습니다.');
      el('pinInput').value='';
      return;
    }
    await unlockEvaluation();
  }catch(err){
    console.error(err);
    alert('PIN 처리 중 오류가 발생했습니다: '+(err.message||err));
  }finally{
    btn.disabled=false;
  }
}

async function unlockEvaluation(){
  if(!state.user||!state.db)return;
  state.appUnlocked=true;
  updateAuthUI();
  setDbStatus('Firebase 연결됨 · Evaluation 사용 가능','on');
  await Promise.all([loadTeachers(),loadStudents()]);
}

function lockEvaluation(){
  if(!state.user)return;
  state.appUnlocked=false;
  clearLoadedDbState();
  updateAuthUI();
  setDbStatus('잠금됨 · 휴대폰 뒷 4자리를 입력해 주세요.','warn');
}

async function logoutFirebase(){
  if(!state.auth)return;
  state.appUnlocked=false;
  await state.auth.signOut();
}

function firebaseAuthErrorMessage(err){
  const code=err&&err.code?err.code:'';
  const messages={
    'auth/invalid-email':'이메일 형식이 올바르지 않습니다.',
    'auth/invalid-credential':'이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/user-disabled':'사용 중지된 계정입니다.',
    'auth/too-many-requests':'로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    'auth/operation-not-allowed':'Firebase Authentication에서 이메일/비밀번호 로그인을 먼저 활성화해야 합니다.'
  };
  return messages[code]||(err&&err.message?err.message:'Firebase 로그인에 실패했습니다.');
}

function requireDb(){
  if(!state.firebaseReady||!state.db){
    alert('Firebase 데이터베이스가 아직 연결되지 않았습니다.');
    return false;
  }
  if(!state.user){
    alert('먼저 선생님 계정으로 로그인해 주세요.');
    return false;
  }
  if(!state.appUnlocked){
    alert('휴대폰 번호 뒷 4자리를 입력해 Evaluation을 열어 주세요.');
    return false;
  }
  return true;
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
    createdBy:state.user?.email||state.user?.uid||'',
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
    updatedBy:state.user?.email||state.user?.uid||'',
    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
  };
  if(state.selectedStudentId){
    await state.db.collection('students').doc(state.selectedStudentId).set(data,{merge:true});
    return state.selectedStudentId;
  }
  const ref=await state.db.collection('students').add({
    ...data,
    createdBy:state.user?.email||state.user?.uid||'',
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
      updatedBy:state.user?.email||state.user?.uid||'',
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

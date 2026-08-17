async function initFirebaseFromSaved(){
  const saved=JSON.stringify(YMS_FIREBASE_CONFIG);
  localStorage.setItem('yms_evaluation_firebase_config',saved);
  el('firebaseConfigInput').value=JSON.stringify(YMS_FIREBASE_CONFIG,null,2);
  await connectFirebase(false);
}
async function connectFirebase(showMessage=true){
  try{
    const raw=el('firebaseConfigInput').value.trim();if(!raw)throw new Error('Firebase 설정 JSON을 입력해 주세요.');
    const config=JSON.parse(raw);if(!config.apiKey||!config.projectId)throw new Error('apiKey와 projectId가 포함된 firebaseConfig가 필요합니다.');
    if(firebase.apps.length){await Promise.all(firebase.apps.map(app=>app.delete().catch(()=>{})))}
    firebase.initializeApp(config);state.auth=firebase.auth();state.db=firebase.firestore();state.firebaseReady=true;
    localStorage.setItem('yms_evaluation_firebase_config',JSON.stringify(config));el('firebaseConfigInput').value=JSON.stringify(config,null,2);
    el('authArea').classList.add('hidden');
    setDbStatus('Firebase 자동 연결 중...','warn');
    state.auth.onAuthStateChanged(async user=>{
      state.user=user||null;
      updateAuthUI();
      if(user){
        await Promise.all([loadTeachers(),loadStudents()]);
        setDbStatus('Firebase 연결됨 · 바로 사용할 수 있습니다.','on');
      }
    });
    if(!state.auth.currentUser){await state.auth.signInAnonymously()}
    if(showMessage)setDbStatus('Firebase 연결됨 · 바로 사용할 수 있습니다.','on');
  }catch(err){
    state.firebaseReady=false;
    const msg=(err&&err.code==='auth/operation-not-allowed')?'Firebase Authentication에서 익명 로그인을 활성화해 주세요.':(err.message||String(err));
    setDbStatus('Firebase 연결 실패: '+msg,'');
    alert('Firebase 연결 오류: '+msg);
  }
}
function resetFirebaseConfig(){localStorage.removeItem('yms_evaluation_firebase_config');el('firebaseConfigInput').value='';location.reload()}
function updateAuthUI(){
  const logged=!!state.user;
  el('logoutButton').classList.toggle('hidden',true);
  el('loginButton').classList.toggle('hidden',true);
  el('loginEmail').disabled=true;
  el('loginPassword').disabled=true;
  el('loginUserText').textContent=logged?'자동 연결됨':'';
}
async function loginFirebase(){return}
async function logoutFirebase(){return}
function requireDb(){
  if(!state.firebaseReady||!state.db){alert('Firebase 데이터베이스가 아직 연결되지 않았습니다.');return false}
  if(!state.user){alert('Firebase 자동 연결 중입니다. 잠시 후 다시 시도해 주세요.');return false}
  return true
}
async function loadTeachers(){
  if(!state.user)return;
  try{const snap=await state.db.collection('teachers').get();state.teachers=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.active!==false).sort((a,b)=>(a.name||'').localeCompare(b.name||'','ko'));el('teacherOptions').innerHTML=state.teachers.map(t=>`<option value="${escapeHtml(t.name||'')}"></option>`).join('')}catch(err){console.error(err)}
}
async function ensureTeacher(name){
  const clean=name.trim();if(!clean)return;const exists=state.teachers.some(t=>(t.name||'').trim()===clean);if(exists)return;
  await state.db.collection('teachers').add({name:clean,active:true,createdAt:firebase.firestore.FieldValue.serverTimestamp()});await loadTeachers();
}
async function loadStudents(){
  if(!state.user)return;
  try{const snap=await state.db.collection('students').get();state.students=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.name||'').localeCompare(b.name||'','ko'));const picker=el('studentPicker');const current=state.selectedStudentId||'';picker.innerHTML='<option value="">새 학생 입력</option>'+state.students.map(s=>`<option value="${s.id}">${escapeHtml(s.name||'(이름 없음)')} · ${escapeHtml(s.studentLevel||'')}</option>`).join('');picker.value=state.students.some(s=>s.id===current)?current:''}catch(err){alert('학생 목록 불러오기 실패: '+(err.message||err))}
}
function clearStudentForm(){state.selectedStudentId=null;el('studentPicker').value='';el('studentName').value='';el('teacherName').value='';el('currentBook').value='';document.querySelector('input[name="schoolType"][value="초등부"]').checked=true;renderGrades();state.scores={};renderSubjects();renderScores();el('evaluationHistory').innerHTML='<option value="">저장된 평가가 없습니다</option>';el('customPos').value='';el('customNeg').value='';el('teacherFeedback').value='';el('saveStatus').textContent='새 학생 입력 모드입니다.'}
async function selectStudent(id){
  if(!id){clearStudentForm();return}
  const s=state.students.find(x=>x.id===id);if(!s)return;state.selectedStudentId=id;el('studentName').value=s.name||'';el('teacherName').value=s.teacherName||'';el('currentBook').value=s.currentBook||'';const radio=document.querySelector(`input[name="schoolType"][value="${s.schoolType||'초등부'}"]`);if(radio)radio.checked=true;renderGrades(s.studentLevel||'');await loadEvaluationHistory(id);el('saveStatus').textContent=`${s.name||'학생'} 학생을 불러왔습니다.`
}
async function saveStudent(){
  const name=el('studentName').value.trim();if(!name)throw new Error('학생 이름을 입력해 주세요.');const teacherName=el('teacherName').value.trim();await ensureTeacher(teacherName);
  const data={name,teacherName,schoolType:getSchoolType(),studentLevel:el('studentLevel').value,currentBook:el('currentBook').value.trim(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
  if(state.selectedStudentId){await state.db.collection('students').doc(state.selectedStudentId).set(data,{merge:true});return state.selectedStudentId}
  const ref=await state.db.collection('students').add({...data,createdAt:firebase.firestore.FieldValue.serverTimestamp()});state.selectedStudentId=ref.id;return ref.id
}
async function saveEvaluation(){
  if(!requireDb())return;const rows=collectScores();if(!rows.length){alert('평가 영역을 하나 이상 선택해 주세요.');return}const btn=el('saveEvaluationButton');btn.disabled=true;el('saveStatus').innerHTML='<span class="spinner"></span>학생정보와 평가를 저장하고 있습니다...';
  try{
    const studentId=await saveStudent();const scores={};rows.forEach(r=>scores[r.id]=r.score);const key=evaluationKey();
    await state.db.collection('students').doc(studentId).collection('evaluations').doc(key).set({evaluationKey:key,year:Number(el('evaluationYear').value),month:monthNumber(),selectedSubjects:rows.map(r=>r.id),scores,teacherName:el('teacherName').value.trim(),strengths:el('customPos').value.trim(),improvements:el('customNeg').value.trim(),feedback:el('teacherFeedback').value.trim(),updatedBy:state.user.email||state.user.uid||'anonymous',updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    await loadStudents();el('studentPicker').value=studentId;await loadEvaluationHistory(studentId);el('evaluationHistory').value=key;el('saveStatus').innerHTML=`<span style="color:var(--green)">✓ ${escapeHtml(el('studentName').value)} · ${key} 평가가 저장되었습니다.</span>`;
  }catch(err){console.error(err);el('saveStatus').innerHTML=`<span style="color:var(--red)">⚠️ 저장 실패: ${escapeHtml(err.message||String(err))}</span>`}finally{btn.disabled=false}
}
async function loadEvaluationHistory(studentId=state.selectedStudentId){
  if(!studentId||!state.user){el('evaluationHistory').innerHTML='<option value="">저장된 평가가 없습니다</option>';return}
  try{const snap=await state.db.collection('students').doc(studentId).collection('evaluations').get();const items=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.id.localeCompare(a.id));el('evaluationHistory').innerHTML=items.length?'<option value="">평가 선택</option>'+items.map(x=>`<option value="${x.id}">${x.id} · ${escapeHtml(x.teacherName||'담임 미지정')}</option>`).join(''):'<option value="">저장된 평가가 없습니다</option>'}catch(err){console.error(err)}
}
async function loadSelectedEvaluation(){
  if(!requireDb())return;const sid=state.selectedStudentId,key=el('evaluationHistory').value;if(!sid){alert('먼저 등록 학생을 선택해 주세요.');return}if(!key){alert('불러올 평가월을 선택해 주세요.');return}
  try{const doc=await state.db.collection('students').doc(sid).collection('evaluations').doc(key).get();if(!doc.exists)throw new Error('평가 기록이 없습니다.');const d=doc.data();el('evaluationYear').value=d.year||Number(key.slice(0,4));el('evaluationMonth').value=`${d.month||Number(key.slice(5,7))}월`;state.scores={...(d.scores||{})};renderSubjects(d.selectedSubjects||Object.keys(d.scores||{}));renderScores();el('teacherName').value=d.teacherName||el('teacherName').value;el('customPos').value=d.strengths||'';el('customNeg').value=d.improvements||'';el('teacherFeedback').value=d.feedback||'';el('saveStatus').textContent=`${key} 평가를 불러왔습니다.`}catch(err){alert('평가 불러오기 실패: '+(err.message||err))}
}
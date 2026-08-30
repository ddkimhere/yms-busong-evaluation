function showLoginMode(mode){
  const teacher=el('teacherLoginArea');
  const admin=el('adminLoginArea');
  const teacherBtn=el('teacherModeButton');
  const adminBtn=el('adminModeButton');
  if(!teacher||!admin)return;
  const isAdmin=mode==='admin';
  teacher.classList.toggle('hidden',isAdmin);
  admin.classList.toggle('hidden',!isAdmin);
  if(teacherBtn)teacherBtn.classList.toggle('secondary',isAdmin);
  if(adminBtn)adminBtn.classList.toggle('secondary',!isAdmin);
  try{localStorage.setItem('yms_evaluation_login_mode',isAdmin?'admin':'teacher')}catch(_){ }
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
  }catch(err){
    console.error(err);
    setDbStatus('관리자 로그인 실패: '+firebaseAuthErrorMessage(err),'warn');
    alert(firebaseAuthErrorMessage(err));
  }finally{
    if(btn)btn.disabled=false;
  }
}

(function initLoginMode(){
  const apply=()=>{
    let mode='teacher';
    try{mode=localStorage.getItem('yms_evaluation_login_mode')||'teacher'}catch(_){ }
    showLoginMode(mode==='admin'?'admin':'teacher');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);
  else apply();
})();

renderGrades();
renderSubjects();
renderScores();
el('evaluationYear').value=new Date().getFullYear();
el('evaluationMonth').value=`${new Date().getMonth()+1}월`;

const YMS_FIREBASE_CONFIG={
  apiKey:'AIzaSyBuXxBX-BffkDQBYL0bDIaQLMkBUC0B3f8',
  authDomain:'yms-ele-evaluation.firebaseapp.com',
  projectId:'yms-ele-evaluation',
  storageBucket:'yms-ele-evaluation.firebasestorage.app',
  messagingSenderId:'578400571836',
  appId:'1:578400571836:web:82ddacfb46f6b52e419bb9'
};
localStorage.setItem('yms_evaluation_firebase_config',JSON.stringify(YMS_FIREBASE_CONFIG));
initFirebaseFromSaved();

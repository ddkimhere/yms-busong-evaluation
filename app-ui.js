renderGrades();
renderSubjects();
renderScores();
el('evaluationYear').value=new Date().getFullYear();
el('evaluationMonth').value=`${new Date().getMonth()+1}월`;
initFirebaseFromSaved();

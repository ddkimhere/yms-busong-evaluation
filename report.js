const GEMINI_API_KEY_STORAGE='yms_evaluation_gemini_api_key';
const GEMINI_MODEL='gemini-2.5-flash';

function getGrowthTestContextForAI(){
  try{
    const code=document.getElementById('growthTestCode')?.value||'';
    if(!code||typeof GROWTH_TESTS==='undefined'||!GROWTH_TESTS[code])return null;
    return {code,...GROWTH_TESTS[code]};
  }catch(_){
    return null;
  }
}

function buildEvaluationPrompt(){
  const rows=typeof collectScores==='function'?collectScores():[];
  const growth=getGrowthTestContextForAI();
  const studentName=document.getElementById('studentName')?.value.trim()||'학생';
  const grade=document.getElementById('studentLevel')?.value||'';
  const book=document.getElementById('currentBook')?.value.trim()||'';
  const strength=document.getElementById('customPos')?.value.trim()||'특별히 입력된 내용 없음';
  const improvement=document.getElementById('customNeg')?.value.trim()||'특별히 입력된 내용 없음';
  const scoreText=rows.length?rows.map(r=>`${r.full}: ${r.score}점`).join('\n'):'영역별 점수 미입력';
  const growthText=growth
    ?`시험코드: ${growth.code}\n학습 단계: ${growth.stage}\n시험 성격: ${growth.summary}\n주요 평가 영역: ${growth.areas}\n시험의 의미: ${growth.meaning}`
    :'Growth Test 시험코드 미선택';

  return `당신은 초등 영어학원의 담임교사입니다. 아래 월간 Evaluation 자료를 바탕으로 학부모에게 전달할 담임 종합 의견을 작성하세요.\n\n[학생 정보]\n학생: ${studentName}\n학년: ${grade}\n현재 교재: ${book}\n\n[이번 달 평가 점수]\n${scoreText}\n\n[Growth Test 정보]\n${growthText}\n\n[교사 입력 메모]\n칭찬/강점: ${strength}\n보완/노력: ${improvement}\n\n[작성 규칙]\n- 한국어로 정확히 5문장 작성합니다.\n- 번호, 불릿, 제목, 마크다운 없이 자연스러운 한 문단으로 작성합니다.\n- 1~2문장은 강점과 성취를 구체적으로 설명합니다.\n- 3~4문장은 보완할 부분을 부드럽고 구체적으로 설명합니다.\n- 마지막 문장은 다음 달 학습 방향과 격려로 마무리합니다.\n- 점수만 나열하지 말고 학생이 어떤 능력을 보여주었는지 해석합니다.\n- Growth Test가 선택된 경우 시험의 단계와 평가 성격을 자연스럽게 반영합니다.\n- '난이도 하', '수준이 낮다'처럼 학부모에게 부정적으로 들릴 표현은 사용하지 않습니다.\n- 과장하거나 실제 자료에 없는 성취를 만들어내지 않습니다.\n- 따뜻하지만 전문적인 담임교사 문체로 작성합니다.`;
}

function extractGeminiText(data){
  const parts=data?.candidates?.[0]?.content?.parts||[];
  return parts.map(p=>p?.text||'').join('').trim();
}

function cleanAiComment(text){
  return String(text||'')
    .replace(/^\s*(종합\s*의견|담임\s*의견)\s*[:：-]?\s*/i,'')
    .replace(/(^|\n)\s*[-*•]\s*/g,'$1')
    .replace(/(^|\n)\s*\d+[.)]\s*/g,'$1')
    .replace(/\n+/g,' ')
    .replace(/\s{2,}/g,' ')
    .trim();
}

async function generateAiEvaluationComment(){
  const apiInput=document.getElementById('apiKey');
  const status=document.getElementById('aiStatus');
  const output=document.getElementById('teacherFeedback');
  const button=document.getElementById('aiButton');
  if(!apiInput||!output||!button)return;

  const apiKey=apiInput.value.trim();
  if(!apiKey){
    if(status)status.textContent='Gemini API Key를 먼저 입력해 주세요.';
    apiInput.focus();
    return;
  }

  localStorage.setItem(GEMINI_API_KEY_STORAGE,apiKey);
  button.disabled=true;
  const originalText=button.textContent;
  button.textContent='🤖 AI 종합 의견 작성 중...';
  if(status)status.textContent='학생 점수와 Growth Test 정보를 분석하고 있습니다...';

  try{
    const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-goog-api-key':apiKey
      },
      body:JSON.stringify({
        contents:[{role:'user',parts:[{text:buildEvaluationPrompt()}]}],
        generationConfig:{
          temperature:0.55,
          maxOutputTokens:650,
          topP:0.9
        }
      })
    });

    const data=await response.json().catch(()=>({}));
    if(!response.ok){
      const msg=data?.error?.message||`Gemini API 오류 (${response.status})`;
      throw new Error(msg);
    }

    const text=cleanAiComment(extractGeminiText(data));
    if(!text)throw new Error('AI 응답에서 종합 의견을 찾지 못했습니다.');

    output.value=text;
    output.dispatchEvent(new Event('input',{bubbles:true}));
    if(status)status.textContent='✓ AI 종합 의견이 생성되었습니다. 아래 내용을 확인한 뒤 필요한 부분만 수정해 주세요.';
  }catch(err){
    console.error('Gemini Evaluation 생성 오류:',err);
    if(status)status.textContent=`AI 생성 실패: ${err.message||String(err)}`;
  }finally{
    button.disabled=false;
    button.textContent=originalText||'🤖 AI에게 5문장 추천받기';
  }
}

function setupEvaluationAI(){
  const apiInput=document.getElementById('apiKey');
  const button=document.getElementById('aiButton');
  const status=document.getElementById('aiStatus');
  if(!apiInput||!button)return;

  const savedKey=localStorage.getItem(GEMINI_API_KEY_STORAGE)||'';
  if(savedKey)apiInput.value=savedKey;
  apiInput.addEventListener('change',()=>{
    const key=apiInput.value.trim();
    if(key)localStorage.setItem(GEMINI_API_KEY_STORAGE,key);
    else localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  });

  button.onclick=generateAiEvaluationComment;
  if(status)status.textContent=savedKey
    ?'Gemini가 연결되어 있습니다. 버튼을 누르면 이번 달 평가 내용을 바탕으로 5문장 종합 의견을 작성합니다.'
    :'Gemini API Key를 한 번 입력하면 이 브라우저에 저장되며, 이후 버튼으로 종합 의견을 자동 작성할 수 있습니다.';

  const heading=[...document.querySelectorAll('h2')].find(h=>h.textContent.includes('AI 종합 의견'));
  const section=heading?.closest('section');
  const banner=section?.querySelector('.success');
  if(banner){
    banner.textContent='🤖 학생의 영역별 점수, 교사 메모, Growth Test 단계와 시험 성격을 함께 분석해 학부모용 종합 의견을 작성합니다.';
  }

  if(document.getElementById('teacherFeedback')?.value.includes('위의 버튼을 누르면')){
    document.getElementById('teacherFeedback').value='';
  }
}

window.generateAiEvaluationComment=generateAiEvaluationComment;
setupEvaluationAI();

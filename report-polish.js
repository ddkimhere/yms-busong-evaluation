(function(){
  const MIDDLE_GROWTH_TESTS={
    'M1-1':{stage:'중등 독해 확장 1',gradeLevel:'중2 중반',areas:'중심 내용 · 세부 정보 · 문맥 · 추론',summary:'중등 독해의 정보량과 문장 구조가 본격적으로 늘어나기 시작하는 단계입니다.',meaning:'기본 독해 정확도를 유지하면서 조금 더 긴 지문과 다양한 유형에 안정적으로 대응하는 힘을 확인합니다.'},
    'M1-2':{stage:'중등 독해 확장 2',gradeLevel:'중2 중반',areas:'중심 내용 · 세부 정보 · 문맥 · 추론',summary:'중2 수준의 독해를 안정적으로 처리하면서 문맥과 세부 정보 판단 비중이 커지는 단계입니다.',meaning:'직접 제시된 정보뿐 아니라 문맥 단서를 활용해 정답 근거를 찾는 능력을 확인합니다.'},
    'M1-3':{stage:'중등 독해 확장 3',gradeLevel:'중2 중~후반',areas:'주제 · 내용 이해 · 문맥 · 논리',summary:'지문 구조와 문장 간 관계를 함께 보아야 하는 문항이 늘어나는 단계입니다.',meaning:'한 문장씩 해석하는 수준을 넘어 글 전체의 전개와 핵심을 연결해 읽는 힘을 확인합니다.'},
    'M1-4':{stage:'중등 논리 독해 입문',gradeLevel:'중2 후반',areas:'주제 · 추론 · 글의 흐름 · 내용 이해',summary:'중2 후반 수준에서 추론과 글의 흐름 판단이 본격적으로 요구되는 단계입니다.',meaning:'앞뒤 문장의 관계를 이용해 글의 논리와 숨은 의미를 파악하는 능력을 확인합니다.'},
    'M1-5':{stage:'중등 논리 독해 확장',gradeLevel:'중2 후반',areas:'중심 내용 · 세부 정보 · 추론 · 논리',summary:'내용 이해와 논리적 판단을 함께 요구하는 중등형 종합 독해 단계입니다.',meaning:'정확한 내용 파악과 함께 문장 관계를 이용해 답을 도출하는 능력을 확인합니다.'},
    'M1-6':{stage:'중3 진입 준비',gradeLevel:'중2 후반 ~ 중3 입문',areas:'주제 · 문맥 · 추론 · 글의 흐름',summary:'중2 독해를 마무리하고 중3 수준의 지문과 사고 유형으로 넘어가는 단계입니다.',meaning:'늘어난 어휘와 문장 길이 속에서도 중심 내용을 놓치지 않고 읽는 힘을 확인합니다.'},
    'M1-7':{stage:'중3 독해 입문',gradeLevel:'중3 입문',areas:'내용 이해 · 문맥 · 추론 · 논리',summary:'중3 수준의 지문 길이와 문제 유형에 적응하기 시작하는 단계입니다.',meaning:'정보를 빠르게 정리하고 문맥과 논리를 함께 활용하는 능력을 확인합니다.'},
    'M1-8':{stage:'중3 독해 기초',gradeLevel:'중3 초반',areas:'주제 · 세부 정보 · 추론 · 글의 흐름',summary:'중3 초반 수준의 독해에서 중심 내용과 세부 정보를 함께 처리하는 단계입니다.',meaning:'글 전체의 핵심과 세부 근거를 균형 있게 읽는 능력을 확인합니다.'},
    'M1-9':{stage:'중3 독해 확장',gradeLevel:'중3 초~중반',areas:'중심 내용 · 문맥 · 추론 · 논리',summary:'중3 수준에서 문맥과 추론의 비중이 점차 높아지는 단계입니다.',meaning:'직접적인 정보 확인을 넘어 문맥 단서와 글의 구조를 활용하는 능력을 확인합니다.'},
    'M1-10':{stage:'중3 종합 독해',gradeLevel:'중3 중반',areas:'주제 · 추론 · 글의 흐름 · 종합 독해',summary:'M1 과정의 최종 단계로 중3 중반 수준의 다양한 독해 유형을 종합적으로 다룹니다.',meaning:'중등 독해의 핵심 유형을 고르게 처리하며 다음 단계로 갈 준비가 되었는지 확인합니다.'},
    'M2-1':{stage:'중3 심화 1',gradeLevel:'중3 중반',areas:'중심 내용 · 세부 정보 · 추론 · 논리',summary:'중3 중반 수준에서 정보량과 사고 부담이 한 단계 높아지는 심화 독해 단계입니다.',meaning:'긴 지문에서 핵심과 근거를 빠르게 구분하고 논리적으로 판단하는 능력을 확인합니다.'},
    'M2-2':{stage:'중3 심화 2',gradeLevel:'중3 중~후반',areas:'주제 · 문맥 · 추론 · 글의 흐름',summary:'중3 후반으로 갈수록 문맥 추론과 글의 구조 판단 비중이 높아지는 단계입니다.',meaning:'문장 간 관계와 문맥 단서를 활용해 정답을 추론하는 능력을 확인합니다.'},
    'M2-3':{stage:'중3 심화 3',gradeLevel:'중3 후반',areas:'중심 내용 · 세부 정보 · 추론 · 논리',summary:'중3 후반 수준의 지문과 다양한 유형을 종합적으로 처리하는 단계입니다.',meaning:'중학교 독해 전반을 안정적으로 수행하고 고등 독해에 필요한 사고력을 준비하는 단계입니다.'},
    'M2-4':{stage:'고등 독해 진입 준비',gradeLevel:'중3 후반 ~ 고1 입문',areas:'주제 · 문맥 · 추론 · 글의 흐름',summary:'중등 독해에서 고등 독해로 넘어가기 직전의 연결 단계입니다.',meaning:'긴 문장 구조와 추상적인 내용에 적응하며 고등형 독해의 기초를 확인합니다.'},
    'M2-5':{stage:'고1 독해 입문',gradeLevel:'고1 입문',areas:'중심 내용 · 세부 정보 · 추론 · 논리',summary:'고1 수준의 지문 구조와 어휘에 본격적으로 진입하는 단계입니다.',meaning:'문장 구조가 복잡해져도 글의 핵심과 논리를 안정적으로 파악하는 능력을 확인합니다.'},
    'M2-6':{stage:'고1 독해 기초',gradeLevel:'고1 초반',areas:'주제 · 문맥 · 추론 · 글의 흐름',summary:'고1 초반 수준의 독해에서 문맥과 논리 판단을 함께 요구하는 단계입니다.',meaning:'고등형 지문을 읽으며 핵심, 세부 정보, 추론을 균형 있게 처리하는 능력을 확인합니다.'},
    'M2-7':{stage:'고1 학력평가 진입',gradeLevel:'고1 초~중반',areas:'주제 · 세부 정보 · 추론 · 논리',summary:'고1 교육청 학력평가형 지문과 문제 유형에 진입하는 단계입니다.',meaning:'학교 내신을 넘어 고등 모의고사형 독해에 필요한 읽기 속도와 사고력을 확인합니다.'},
    'M3-1':{stage:'고1 학력평가 기초',gradeLevel:'고1 중반',areas:'중심 내용 · 문맥 · 추론 · 논리',summary:'고1 학력평가형 독해를 안정적으로 처리하기 시작하는 단계입니다.',meaning:'긴 지문에서 핵심 내용을 빠르게 찾고 문맥과 논리를 연결하는 능력을 확인합니다.'},
    'M3-2':{stage:'고1 학력평가 확장',gradeLevel:'고1 중반',areas:'주제 · 세부 정보 · 추론 · 글의 흐름',summary:'고1 수준의 다양한 독해 유형을 더 넓게 다루는 단계입니다.',meaning:'고등형 독해에서 문제 유형별 접근법을 적용하고 근거를 정확히 찾는 능력을 확인합니다.'},
    'M3-3':{stage:'고1 학력평가 심화 1',gradeLevel:'고1 중~후반',areas:'중심 내용 · 문맥 · 빈칸 추론 · 논리',summary:'추상적 소재와 추론형 문항의 비중이 높아지는 고1 심화 단계입니다.',meaning:'표면적인 해석을 넘어 글의 논리와 핵심 관계를 파악하는 능력을 확인합니다.'},
    'M3-4':{stage:'고1 학력평가 심화 2',gradeLevel:'고1 후반',areas:'주제 · 추론 · 글의 순서 · 문장 관계',summary:'고1 후반 수준에서 논리적 흐름과 추론 부담이 높은 문항을 다루는 단계입니다.',meaning:'복잡한 글의 구조를 파악하고 문장 간 관계를 이용해 답을 도출하는 능력을 확인합니다.'},
    'M3-5':{stage:'고1 학력평가 심화 3',gradeLevel:'고1 후반',areas:'중심 내용 · 문맥 · 추론 · 종합 독해',summary:'고1 후반 수준의 지문을 종합적으로 처리하며 고난도 유형에 적응하는 단계입니다.',meaning:'정보량이 많고 추상적인 글에서도 핵심 논리를 유지하며 읽는 힘을 확인합니다.'},
    'M3-6':{stage:'고등 심화 독해 연결',gradeLevel:'고1 후반 ~ 고2 입문',areas:'주제 · 빈칸 추론 · 글의 흐름 · 종합 독해',summary:'고1 상위 수준에서 고2 독해로 넘어가기 위한 연결 단계입니다.',meaning:'고난도 지문에서 추론과 논리 구조를 안정적으로 처리할 수 있는지 확인합니다.'},
    'M3-7':{stage:'고등 심화 독해 입문',gradeLevel:'고2 입문',areas:'중심 내용 · 고난도 추론 · 논리 · 종합 독해',summary:'현재 YMS 중등 Growth Test의 최고 단계로 고1 상위권에서 고2 입문 수준의 독해 사고력을 확인합니다.',meaning:'복잡한 문장 구조와 추상적 지문에서도 핵심 논리와 정답 근거를 끝까지 추적하는 능력을 확인합니다.'}
  };

  const E_GRADE_LEVELS={
    'E1-1':'초6 후반 ~ 중1 입문','E1-2':'초6 후반 ~ 중1 입문','E1-3':'중1 입문','E1-4':'중1 초반','E1-5':'중1 초 ~ 중반','E1-6':'중1 중반',
    'E2-1':'중1 중반','E2-2':'중1 중 ~ 후반','E2-3':'중1 후반','E2-4':'중1 후반','E2-5':'중1 후반 ~ 중2 입문','E2-6':'중2 입문','E3-1':'중2 초반','E3-2':'중2 초 ~ 중반'
  };

  function mergeData(){
    if(typeof GROWTH_TESTS==='undefined')return;
    Object.entries(E_GRADE_LEVELS).forEach(([code,level])=>{if(GROWTH_TESTS[code])GROWTH_TESTS[code].gradeLevel=level});
    Object.entries(MIDDLE_GROWTH_TESTS).forEach(([code,meta])=>{GROWTH_TESTS[code]={...(GROWTH_TESTS[code]||{}),...meta}});
    if(typeof GROWTH_TEST_ORDER!=='undefined')Object.keys(MIDDLE_GROWTH_TESTS).forEach(code=>{if(!GROWTH_TEST_ORDER.includes(code))GROWTH_TEST_ORDER.push(code)});
  }

  function syncSelect(){
    mergeData();
    const select=document.getElementById('growthTestCode');
    if(!select||typeof GROWTH_TESTS==='undefined'||typeof GROWTH_TEST_ORDER==='undefined')return;
    const current=select.value;
    select.innerHTML='<option value="">선택 안 함</option>'+GROWTH_TEST_ORDER.map(code=>{
      const m=GROWTH_TESTS[code]||{};
      const level=m.gradeLevel?` · ${m.gradeLevel}`:'';
      return `<option value="${escapeHtml(code)}">${escapeHtml(code)} · ${escapeHtml(m.stage||'')}${escapeHtml(level)}</option>`;
    }).join('');
    if(current&&GROWTH_TESTS[current])select.value=current;
  }

  function addStyles(){
    if(document.getElementById('reportPolishStyles'))return;
    const style=document.createElement('style');
    style.id='reportPolishStyles';
    style.textContent=`
      .student-strip{margin:0 0 22px!important;padding:0!important;background:transparent!important;border-radius:14px!important;line-height:1.4!important;color:#26354d!important;overflow:hidden;border:1px solid #dfe6f2;box-shadow:0 4px 14px rgba(26,50,99,.06)}
      .student-profile-top{display:flex;align-items:center;padding:17px 18px;background:linear-gradient(135deg,#f3f7ff 0%,#ffffff 100%);border-bottom:1px solid #e6ebf3}
      .student-kicker{font-size:10px;letter-spacing:1.3px;color:#8390a6;font-weight:800;margin-bottom:2px}.student-name{font-size:21px;line-height:1.2;color:#172f5f;font-weight:900}
      .student-info-grid{display:grid;grid-template-columns:repeat(3,1fr);background:#fff}.student-info-item{padding:12px 15px;border-right:1px solid #edf0f5}.student-info-item:last-child{border-right:0}.student-info-label{display:block;font-size:10px;color:#8a95a8;font-weight:800;margin-bottom:4px}.student-info-value{display:block;font-size:13px;color:#273751;font-weight:800}
      .growth-report{margin:0 0 27px!important;padding:0!important;border:1.5px solid #cddaf0!important;border-radius:16px!important;background:#fff!important;overflow:hidden;box-shadow:0 6px 18px rgba(26,50,99,.07)}
      .growth-report-top{display:grid;grid-template-columns:minmax(0,1fr) 280px;background:linear-gradient(135deg,#edf4ff 0%,#f9fbff 68%,#fff9ed 100%);border-bottom:1px solid #dce5f3}
      .growth-identity{padding:18px 20px}.growth-eyebrow{font-size:10px;letter-spacing:1.25px;font-weight:900;color:#6d7e9b;margin-bottom:7px}.growth-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.growth-code{font-size:26px!important;font-weight:900!important;color:#173b70!important}.growth-stage{padding:6px 10px!important;border-radius:999px!important;background:#dbe8ff!important;color:#214e8c!important;font-size:12px!important;font-weight:800!important}
      .growth-level-card{padding:15px 17px;background:rgba(255,249,234,.84);border-left:1px solid #eadfca;display:flex;flex-direction:column;justify-content:center}.growth-level-label{font-size:10px;color:#8d713c;font-weight:900;margin-bottom:5px}.growth-level-value{font-size:16px;line-height:1.35;color:#8a5a00;font-weight:900}.growth-level-sub{font-size:9.5px;line-height:1.4;color:#a08d69;margin-top:5px}
      .growth-content{padding:16px 19px 13px}.growth-summary-box{padding:13px 15px;border-radius:11px;background:#f8faff;border:1px solid #e5ebf5;margin-bottom:11px}.growth-block-label{display:flex;align-items:center;gap:6px;font-size:11px;color:#53647f;font-weight:900;margin-bottom:6px}.growth-block-text{font-size:13px;line-height:1.65;color:#283851}.growth-areas-wrap{display:flex;flex-wrap:wrap;gap:6px}.growth-area-tag{padding:6px 9px;border-radius:8px;background:#eef3fb;border:1px solid #dbe4f1;color:#24466f;font-size:11px;font-weight:800}.growth-meaning{padding:12px 14px;border-left:4px solid #1A3263;background:#f8f9fc;border-radius:0 10px 10px 0;color:#283851;font-size:12.5px;line-height:1.65}
      .growth-progress{display:flex!important;gap:4px!important;flex-wrap:wrap!important;margin:14px 19px 0!important;padding-top:11px;border-top:1px solid #edf0f5}.growth-step{font-size:9.5px!important;padding:4px 6px!important;border-radius:999px!important;background:#f0f2f5!important;color:#9aa3b0!important}.growth-step.current{background:#1A3263!important;color:#fff!important;font-weight:900!important}.growth-grade-note{margin:8px 19px 15px!important;font-size:9px!important;line-height:1.45!important;color:#9aa3b1!important}
      .growth-preview-mini .growth-preview-level{display:inline-block;margin:7px 0;padding:5px 9px;border-radius:999px;background:#fff4dc;color:#8a5a00;font-weight:800;font-size:12px}
      @media(max-width:620px){.student-info-grid,.growth-report-top{grid-template-columns:1fr}.student-info-item{border-right:0;border-bottom:1px solid #edf0f5}.growth-level-card{border-left:0;border-top:1px solid #eadfca}}
    `;
    document.head.appendChild(style);
  }

  function reportHtml(code){
    mergeData();
    const meta=typeof GROWTH_TESTS!=='undefined'?GROWTH_TESTS[code]:null;
    if(!meta)return '';
    const areas=String(meta.areas||'').split('·').map(v=>v.trim()).filter(Boolean);
    return `<div class="growth-report"><div class="growth-report-top"><div class="growth-identity"><div class="growth-eyebrow">YMS GROWTH TEST · THIS MONTH</div><div class="growth-title-row"><span class="growth-code">📘 ${escapeHtml(code)}</span><span class="growth-stage">${escapeHtml(meta.stage||'')}</span></div></div><div class="growth-level-card"><div class="growth-level-label">국가 교육과정 기준 예상 수준</div><div class="growth-level-value">${escapeHtml(meta.gradeLevel||'-')}</div><div class="growth-level-sub">2022 개정 영어과 교육과정 비교 기준</div></div></div><div class="growth-content"><div class="growth-summary-box"><div class="growth-block-label">📘 이번 Growth Test는 어떤 시험인가요?</div><div class="growth-block-text">${escapeHtml(meta.summary||'')}</div></div><div class="growth-summary-box"><div class="growth-block-label">🎯 주요 평가 영역</div><div class="growth-areas-wrap">${areas.map(a=>`<span class="growth-area-tag">${escapeHtml(a)}</span>`).join('')}</div></div><div class="growth-block-label">💡 이번 시험의 의미</div><div class="growth-meaning">${escapeHtml(meta.meaning||'')}</div></div><div class="growth-progress">${GROWTH_TEST_ORDER.map(c=>`<span class="growth-step ${c===code?'current':''}">${escapeHtml(c)}</span>`).join('')}</div><div class="growth-grade-note">※ 예상 수준은 2022 개정 영어과 교육과정의 읽기 성취기준과 시험의 지문 난도·문항 사고 수준을 비교한 참고 정보이며, 교과서 출판사와 학교 진도에 따라 차이가 있을 수 있습니다.</div></div>`;
  }

  function preview(){
    mergeData();
    const box=document.getElementById('growthTestPreview');
    const code=document.getElementById('growthTestCode')?.value||'';
    if(!box)return;
    const meta=typeof GROWTH_TESTS!=='undefined'?GROWTH_TESTS[code]:null;
    if(!meta){box.textContent='시험코드를 선택하면 시험의 평가 성격과 예상 수준이 표시됩니다.';return}
    box.innerHTML=`<strong>${escapeHtml(code)} · ${escapeHtml(meta.stage||'')}</strong><br><span class="growth-preview-level">국가 교육과정 기준 예상 수준 · ${escapeHtml(meta.gradeLevel||'-')}</span><br>${escapeHtml(meta.summary||'')}`;
  }

  function renderStudent(){
    const strip=document.getElementById('studentStrip');if(!strip)return;
    const name=document.getElementById('studentName')?.value.trim()||'학생';
    const grade=document.getElementById('studentLevel')?.value||'학년 미입력';
    const book=document.getElementById('currentBook')?.value.trim()||'교재 미입력';
    const teacher=document.getElementById('teacherName')?.value.trim()||'미지정';
    strip.innerHTML=`<div class="student-profile-top"><div><div class="student-kicker">STUDENT PROFILE</div><div class="student-name">${escapeHtml(name)}</div></div></div><div class="student-info-grid"><div class="student-info-item"><span class="student-info-label">학년</span><span class="student-info-value">${escapeHtml(grade)}</span></div><div class="student-info-item"><span class="student-info-label">현재 교재</span><span class="student-info-value">${escapeHtml(book)}</span></div><div class="student-info-item"><span class="student-info-label">담임선생님</span><span class="student-info-value">${escapeHtml(teacher)}</span></div></div>`;
  }

  function patch(){
    mergeData();addStyles();syncSelect();
    const field=document.getElementById('growthTestField');if(field)field.classList.remove('hidden');

    window.toggleGrowthTestField=function(){
      const field=document.getElementById('growthTestField');if(field)field.classList.remove('hidden');
      syncSelect();preview();
    };
    window.renderGrowthTestPreview=preview;
    window.growthReportHtml=reportHtml;
    window.renderGrowthReportBlock=function(){
      const block=document.getElementById('growthTestReportBlock');if(!block)return;
      const code=document.getElementById('growthTestCode')?.value||'';
      block.innerHTML=reportHtml(code);
    };

    const select=document.getElementById('growthTestCode');
    if(select&&!select.dataset.fixedGrowth){select.dataset.fixedGrowth='1';select.addEventListener('change',()=>{preview();window.renderGrowthReportBlock();});}

    if(typeof window.generateReport==='function'&&!window.__growthReportPatched){
      window.__growthReportPatched=true;
      const original=window.generateReport;
      window.generateReport=function(){
        const result=original.apply(this,arguments);
        renderStudent();
        window.renderGrowthReportBlock();
        return result;
      };
    }

    preview();
  }

  patch();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,0));
  else setTimeout(patch,0);
})();
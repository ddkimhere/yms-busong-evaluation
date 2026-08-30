(function(){
  function addPolishStyles(){
    if(document.getElementById('reportPolishStyles'))return;
    const style=document.createElement('style');
    style.id='reportPolishStyles';
    style.textContent=`
      .student-strip{margin:0 0 22px!important;padding:0!important;background:transparent!important;border-radius:14px!important;line-height:1.4!important;color:#26354d!important;overflow:hidden;border:1px solid #dfe6f2;box-shadow:0 4px 14px rgba(26,50,99,.06)}
      .student-profile-top{display:flex;align-items:center;gap:14px;padding:17px 18px;background:linear-gradient(135deg,#f3f7ff 0%,#ffffff 100%);border-bottom:1px solid #e6ebf3}
      .student-avatar{width:44px;height:44px;flex:0 0 44px;border-radius:13px;background:#1A3263;color:#fff;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;box-shadow:0 4px 10px rgba(26,50,99,.18)}
      .student-kicker{font-size:10px;letter-spacing:1.3px;color:#8390a6;font-weight:800;margin-bottom:2px}
      .student-name{font-size:21px;line-height:1.2;color:#172f5f;font-weight:900;letter-spacing:-.3px}
      .student-info-grid{display:grid;grid-template-columns:repeat(3,1fr);background:#fff}
      .student-info-item{padding:12px 15px;border-right:1px solid #edf0f5;min-width:0}
      .student-info-item:last-child{border-right:0}
      .student-info-label{display:block;font-size:10px;color:#8a95a8;font-weight:800;letter-spacing:.4px;margin-bottom:4px}
      .student-info-value{display:block;font-size:13px;color:#273751;font-weight:800;white-space:normal;word-break:keep-all}

      .growth-report{margin:0 0 27px!important;padding:0!important;border:1.5px solid #cddaf0!important;border-radius:16px!important;background:#fff!important;overflow:hidden;box-shadow:0 6px 18px rgba(26,50,99,.07)}
      .growth-report-top{display:grid;grid-template-columns:minmax(0,1fr) 245px;gap:0;background:linear-gradient(135deg,#edf4ff 0%,#f9fbff 68%,#fff9ed 100%);border-bottom:1px solid #dce5f3}
      .growth-identity{padding:18px 20px}
      .growth-eyebrow{font-size:10px;letter-spacing:1.25px;font-weight:900;color:#6d7e9b;margin-bottom:7px}
      .growth-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .growth-code{font-size:26px!important;line-height:1;font-weight:900!important;color:#173b70!important;letter-spacing:-.4px}
      .growth-stage{padding:6px 10px!important;border-radius:999px!important;background:#dbe8ff!important;color:#214e8c!important;font-size:12px!important;font-weight:800!important}
      .growth-level-card{padding:15px 17px;background:rgba(255,249,234,.84);border-left:1px solid #eadfca;display:flex;flex-direction:column;justify-content:center}
      .growth-level-label{font-size:10px;color:#8d713c;font-weight:900;letter-spacing:.3px;margin-bottom:5px}
      .growth-level-value{font-size:16px;line-height:1.35;color:#8a5a00;font-weight:900;word-break:keep-all}
      .growth-level-sub{font-size:9.5px;line-height:1.4;color:#a08d69;margin-top:5px}

      .growth-content{padding:16px 19px 13px}
      .growth-summary-box{padding:13px 15px;border-radius:11px;background:#f8faff;border:1px solid #e5ebf5;margin-bottom:11px}
      .growth-block-label{display:flex;align-items:center;gap:6px;font-size:11px;color:#53647f;font-weight:900;margin-bottom:6px}
      .growth-block-text{font-size:13px;line-height:1.65;color:#283851}
      .growth-areas-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
      .growth-area-tag{padding:6px 9px;border-radius:8px;background:#eef3fb;border:1px solid #dbe4f1;color:#24466f;font-size:11px;font-weight:800}
      .growth-meaning{padding:12px 14px;border-left:4px solid #1A3263;background:#f8f9fc;border-radius:0 10px 10px 0;color:#283851;font-size:12.5px;line-height:1.65}
      .growth-progress{display:flex!important;gap:4px!important;flex-wrap:wrap!important;margin:14px 19px 0!important;padding-top:11px;border-top:1px solid #edf0f5}
      .growth-step{font-size:9.5px!important;padding:4px 6px!important;border-radius:999px!important;background:#f0f2f5!important;color:#9aa3b0!important}
      .growth-step.current{background:#1A3263!important;color:#fff!important;font-weight:900!important;box-shadow:0 2px 6px rgba(26,50,99,.18)}
      .growth-grade-note{margin:8px 19px 15px!important;font-size:9px!important;line-height:1.45!important;color:#9aa3b1!important}

      @media(max-width:620px){
        .student-info-grid{grid-template-columns:1fr}
        .student-info-item{border-right:0;border-bottom:1px solid #edf0f5}
        .student-info-item:last-child{border-bottom:0}
        .growth-report-top{grid-template-columns:1fr}
        .growth-level-card{border-left:0;border-top:1px solid #eadfca}
      }
    `;
    document.head.appendChild(style);
  }

  function renderPolishedStudentInfo(){
    const strip=document.getElementById('studentStrip');
    if(!strip)return;
    const name=document.getElementById('studentName')?.value.trim()||'학생';
    const grade=document.getElementById('studentLevel')?.value||'학년 미입력';
    const book=document.getElementById('currentBook')?.value.trim()||'교재 미입력';
    const teacher=document.getElementById('teacherName')?.value.trim()||'미지정';
    const initial=name.trim().charAt(0)||'Y';
    strip.innerHTML=`
      <div class="student-profile-top">
        <div class="student-avatar">${escapeHtml(initial)}</div>
        <div>
          <div class="student-kicker">STUDENT PROFILE</div>
          <div class="student-name">${escapeHtml(name)}</div>
        </div>
      </div>
      <div class="student-info-grid">
        <div class="student-info-item"><span class="student-info-label">학년</span><span class="student-info-value">${escapeHtml(grade)}</span></div>
        <div class="student-info-item"><span class="student-info-label">현재 교재</span><span class="student-info-value">${escapeHtml(book)}</span></div>
        <div class="student-info-item"><span class="student-info-label">담임선생님</span><span class="student-info-value">${escapeHtml(teacher)}</span></div>
      </div>`;
  }

  function polishedGrowthReportHtml(code){
    if(typeof GROWTH_TESTS==='undefined')return '';
    const meta=GROWTH_TESTS[code];
    if(!meta)return '';
    const level=meta.gradeLevel||'';
    const areas=String(meta.areas||'').split('·').map(v=>v.trim()).filter(Boolean);
    return `<div class="growth-report">
      <div class="growth-report-top">
        <div class="growth-identity">
          <div class="growth-eyebrow">YMS GROWTH TEST · THIS MONTH</div>
          <div class="growth-title-row"><span class="growth-code">${escapeHtml(code)}</span><span class="growth-stage">${escapeHtml(meta.stage)}</span></div>
        </div>
        <div class="growth-level-card">
          <div class="growth-level-label">국가 교육과정 기준 예상 수준</div>
          <div class="growth-level-value">${escapeHtml(level)}</div>
          <div class="growth-level-sub">2022 개정 영어과 교육과정 비교 기준</div>
        </div>
      </div>
      <div class="growth-content">
        <div class="growth-summary-box">
          <div class="growth-block-label">📘 이번 시험의 성격</div>
          <div class="growth-block-text">${escapeHtml(meta.summary)}</div>
        </div>
        <div class="growth-summary-box">
          <div class="growth-block-label">🎯 주요 평가 포인트</div>
          <div class="growth-areas-wrap">${areas.map(a=>`<span class="growth-area-tag">${escapeHtml(a)}</span>`).join('')}</div>
        </div>
        <div class="growth-block-label">💡 이번 단계에서 확인하는 힘</div>
        <div class="growth-meaning">${escapeHtml(meta.meaning)}</div>
      </div>
      <div class="growth-progress">${GROWTH_TEST_ORDER.map(c=>`<span class="growth-step ${c===code?'current':''}">${escapeHtml(c)}</span>`).join('')}</div>
      <div class="growth-grade-note">※ 예상 수준은 2022 개정 영어과 교육과정의 읽기 성취기준과 시험의 지문 난도·문항 사고 수준을 비교한 참고 정보이며, 교과서 출판사와 학교 진도에 따라 차이가 있을 수 있습니다.</div>
    </div>`;
  }

  function installPolishedReport(){
    addPolishStyles();
    window.growthReportHtml=polishedGrowthReportHtml;

    const originalGenerate=window.generateReport;
    if(typeof originalGenerate==='function'&&!window.__polishedGenerateInstalled){
      window.__polishedGenerateInstalled=true;
      window.generateReport=function(){
        const result=originalGenerate.apply(this,arguments);
        renderPolishedStudentInfo();
        if(typeof window.renderGrowthReportBlock==='function')window.renderGrowthReportBlock();
        return result;
      };
    }
  }

  window.addEventListener('DOMContentLoaded',()=>setTimeout(installPolishedReport,0));
})();

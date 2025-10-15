// --- Estado ---
let numTeams = 0;
let teams = []; // {name, score, colorClass}
let availableQuestions = [];
let usedQuestions = [];
let lastQuestion = null;
let lastAnswerShown = null;
const teamColorClasses = ['team-0','team-1','team-2','team-3'];

// --- Utilidades ---
function shuffleArray(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} }

function updateScoreboard(){
  const board = document.getElementById('scoreboard'); board.innerHTML='';
  teams.forEach((t,idx)=>{
    const div = document.createElement('div'); div.className='score-item';
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="score-color ${teamColorClasses[idx]}" style="width:18px;height:18px;border-radius:4px;margin-right:8px"></div>
        <div>
          <div style="font-weight:900">${t.name}</div>
          <div class="small-muted">Team ${idx+1}</div>
        </div>
      </div>
      <div style="font-size:1.1rem">${t.score}</div>
    `;
    board.appendChild(div);
  });
}

// --- Configuración de equipos ---
async function askNumberOfTeams(){
  await Swal.fire({
    title:'¿Cuántos equipos participan?',
    showCancelButton:false, allowOutsideClick:false,
    html: `<div class="d-flex gap-2 justify-content-center">
             <button class="swal2-confirm btn-team-select" data-n="2" style="margin:6px;padding:8px 16px">2</button>
             <button class="swal2-confirm btn-team-select" data-n="3" style="margin:6px;padding:8px 16px">3</button>
             <button class="swal2-confirm btn-team-select" data-n="4" style="margin:6px;padding:8px 16px">4</button>
           </div>`,
    didOpen: ()=>{
      document.querySelectorAll('.btn-team-select').forEach(b=>{
        b.addEventListener('click', e=>{
          const n = parseInt(e.currentTarget.dataset.n,10);
          Swal.close();
          setTimeout(()=> promptTeamNames(n), 160);
        });
      });
    }
  });
}

async function promptTeamNames(n){
  numTeams = n; teams = [];
  for(let i=0;i<n;i++){
    const { value: name } = await Swal.fire({
      title:`Nombre del equipo ${i+1}`,
      input:'text', inputLabel:`Escribí el nombre del equipo ${i+1}`, inputPlaceholder:`Equipo ${i+1}`, inputValue:`Team ${i+1}`, allowOutsideClick:false, showCancelButton:false
    });
    teams.push({ name: name ? name.trim() : `Team ${i+1}`, score:0, colorClass: teamColorClasses[i] });
  }
  initializeQuestions();
  updateScoreboard();
  document.getElementById('nextQuestionBtn').disabled = false;
  Swal.fire({ icon:'success', title:'Equipos listos', timer:900, showConfirmButton:false });
}

// --- Preguntas ---
function initializeQuestions(){
  availableQuestions = Array.isArray(questions) ? [...questions] : [];
  shuffleArray(availableQuestions);
  usedQuestions = [];
  lastQuestion = null;
  lastAnswerShown = null;
  document.getElementById('lastAction').innerText = 'Juego listo. Presioná Siguiente pregunta.';
}

function pickQuestion(){
  if ((!availableQuestions || availableQuestions.length===0) && (!usedQuestions || usedQuestions.length===0)) {
    Swal.fire({ icon:'info', title:'No hay preguntas', text:'Agregá preguntas en el array.' });
    return null;
  }
  if (availableQuestions.length === 0){
    availableQuestions = [...usedQuestions];
    usedQuestions = [];
    shuffleArray(availableQuestions);
  }
  const q = availableQuestions.shift();
  usedQuestions.push(q);
  lastQuestion = q;
  return q;
}

// --- Modal de pregunta ---
function buildQuestionHtml(q, { optionsShown=false, failedTeams=[], activeTeam=null } = {}){
  const imgHtml = q.image ? `<div style="text-align:center"><img src="${q.image}" class="question-img" alt="Imagen pregunta"></div>` : '';

  const teamButtonsHtml = teams.map((t, idx) => {
    let disabled = '';
    let btnStyle = '';
    if(failedTeams.includes(idx)) { 
      disabled = 'disabled';
      btnStyle = 'opacity:0.4;cursor:not-allowed;';
    } else if(activeTeam !== null && activeTeam !== idx){
      disabled = 'disabled';
      btnStyle = 'opacity:0.5;';
    }
    return `
      <div style="display:inline-block;margin:8px;text-align:center">
        <div class="team-btn ${t.colorClass}" data-team="${idx}" data-team-name="${t.name}" role="button" style="${btnStyle} ${disabled ? 'pointer-events:none;' : ''}">${idx+1}</div>
        <div class="team-label">${t.name}</div>
      </div>
    `;
  }).join('');

  let optionsHtml = '';
  if(optionsShown){
    optionsHtml = `<div style="margin-top:12px;text-align:center">${q.options.map((op,i)=>`<div class="points-badge mb-1" style="display:block">${String.fromCharCode(65+i)}. ${op}</div>`).join('')}</div>
                   <div class="small-muted mt-2">Valor: <span class="points-badge">${q.points} pts</span></div>`;
  } else {
    optionsHtml = `<div class="small-muted mt-2">Vale <span class="points-badge">${q.points} pts</span> — <strong>x2</strong> si responden sin opciones</div>`;
  }

  return `
    <div style="text-align:center;padding:8px">
      ${imgHtml}
      <div style="font-size:1.05rem;font-weight:800;margin-bottom:8px">${q.question}</div>
      <div style="margin:12px 0">${teamButtonsHtml}</div>
      <div style="margin-top:8px">
        <button id="showOptionsBtn" class="swal2-styled" style="background:#222;border:1px solid rgba(255,255,255,0.06;padding:8px 12px;margin-right:8px">Mostrar opciones</button>
        <button id="showAnswerBtn" class="swal2-styled" style="background:#111;border:1px solid rgba(255,255,255,0.06;padding:8px 12px">Mostrar respuesta</button>
      </div>
      <div id="optionsArea">${optionsHtml}</div>
    </div>
  `;
}

async function showQuestionModal(q, { optionsShown=false, failedTeams=[] } = {}){
  if (!q) return;

  const html = buildQuestionHtml(q, { optionsShown, failedTeams, activeTeam:null });
  await Swal.fire({
    title: `Pregunta (vale ${q.points} pts)`,
    html,
    width:900,
    showConfirmButton:false,
    allowOutsideClick:false,
    didOpen: ()=>{
      const modalDom = Swal.getHtmlContainer();

      modalDom.querySelectorAll('.team-btn').forEach(btn=>{
        btn.addEventListener('click', async (e)=>{
          const teamIdx = parseInt(btn.dataset.team,10);
          if(failedTeams.includes(teamIdx)) return;

          // Reabrir modal con este equipo activo y grayout para los demás
          const activeTeam = teamIdx;
          Swal.close();
          setTimeout(()=> showTeamAnswer(q, activeTeam, optionsShown, failedTeams), 150);
        });
      });

      document.getElementById('showOptionsBtn').addEventListener('click', ()=>{
        if(optionsShown) return;
        optionsShown = true;
        setTimeout(()=> showQuestionModal(q, { optionsShown, failedTeams }), 150);
      });

      document.getElementById('showAnswerBtn').addEventListener('click', async ()=>{
        await revealAnswer(q, null, false);
      });
    }
  });
}

// --- Manejo de respuesta de equipo ---
async function showTeamAnswer(q, teamIdx, optionsShown, failedTeams){
  const res = await Swal.fire({
    title: `${teams[teamIdx].name} quiere responder`,
    text: `¿Respondió correctamente?`,
    icon:'question',
    showCancelButton:true,
    confirmButtonText:'Sí (acertó)',
    cancelButtonText:'No (falló)',
    allowOutsideClick:false
  });

  if(res.isConfirmed){
    const multiplier = optionsShown ? 1 : 2;
    const gained = q.points * multiplier;
    teams[teamIdx].score += gained;
    updateScoreboard();
    lastAnswerShown = { question: q, team: teams[teamIdx].name, gained, correct: q.options[q.correct] };
    await revealAnswer(q, teams[teamIdx], !optionsShown);
  } else {
    failedTeams.push(teamIdx);
    const stillPossible = teams.some((_, idx)=> !failedTeams.includes(idx));
    if(stillPossible){
      document.getElementById('lastAction').innerText = `${teams[teamIdx].name} falló. Otro equipo puede intentar.`;
      setTimeout(()=> showQuestionModal(q, { optionsShown, failedTeams }), 250);
    } else {
      await revealAnswer(q, null, false);
    }
  }
}

// --- Mostrar respuesta ---
function revealAnswer(q, teamObj, wasWithoutOptions){
  return new Promise(resolve=>{
    const answerText = q.options[q.correct];
    const pointsText = teamObj ? `+${ (wasWithoutOptions ? q.points*2 : q.points) } pts para ${teamObj.name}` : '';
    Swal.fire({
      title:'Respuesta correcta',
      html:`<div>${answerText}</div><div class="small-muted mt-1">${pointsText}</div>`,
      icon:'info'
    }).then(()=> resolve());
  });
}

// --- Botón siguiente pregunta ---
document.getElementById('nextQuestionBtn').addEventListener('click', ()=>{
  const q = pickQuestion();
  showQuestionModal(q);
});

// --- Inicio ---
askNumberOfTeams();

// ----------------- Estado global -----------------
let teams = [];                // {name, score, colorClass}
let availableQuestions = [];   // preguntas no usadas aún
let usedQuestions = [];        // preguntas ya mostradas
let lastQuestion = null;

let totalQuestions = 5;
let questionsAsked = 0;
let gamePaused = false;

// ----------------- Utilidades -----------------
function shuffleArray(a){ for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }

// ----------------- Arcade / inicio -----------------
let selectedColors = new Set();

document.querySelectorAll('.arcade-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const color = btn.dataset.color;
    if(selectedColors.has(color)){
      selectedColors.delete(color);
      btn.classList.remove('selected');
    } else {
      selectedColors.add(color);
      btn.classList.add('selected');
    }
  });
});

document.getElementById('startGameBtn').addEventListener('click', ()=>{
  const n = parseInt(document.getElementById('questionCountInput').value,10) || 5;
  totalQuestions = Math.max(1, n);
  document.getElementById('totalCount').innerText = totalQuestions;

  if(selectedColors.size < 2){
    Swal.fire({ icon:'warning', title:'Seleccioná al menos 2 equipos', toast:true, timer:1500, showConfirmButton:false });
    return;
  }

  teams = Array.from(selectedColors).map(color=>{
    const name = color.replace('--team-','').toUpperCase();
    return { name, score:0, colorClass: color };
  });

  // ocultar pantalla arcade y mostrar juego
  document.getElementById('arcadeScreen').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';

  initializeQuestions();
  updateScoreboard();
  showNextQuestion(); // arranca
});

// Botón continuar tras pausa
document.getElementById('continueBtn').addEventListener('click', ()=>{
  gamePaused = false;
  document.getElementById('continueBtn').style.display = 'none';
  // seguir con la misma pregunta (si lastQuestion existe, mostrar modal otra vez)
  if(lastQuestion) {
    // forzar re-mostrar la misma pregunta con su estado actual
    showQuestionModal(lastQuestion, lastQuestionState.failedTeams, lastQuestionState.disabledOptionIdxs);
  } else {
    showNextQuestion();
  }
});

// Reiniciar
document.getElementById('restartBtn').addEventListener('click', ()=> location.reload());

// ----------------- Preguntas: init y pick -----------------
function initializeQuestions(){
  availableQuestions = Array.isArray(questions) ? [...questions] : [];
  shuffleArray(availableQuestions);
  usedQuestions = [];
  lastQuestion = null;
  questionsAsked = 0;
  document.getElementById('askedCount').innerText = questionsAsked;
  document.getElementById('totalCount').innerText = totalQuestions;
  document.getElementById('lastAction').innerText = 'Juego listo';
  renderEmptyQuestionCard();
}

function pickQuestion(){
  if(availableQuestions.length === 0) return null;
  const q = availableQuestions.shift();
  usedQuestions.push(q);
  lastQuestion = q;
  return q;
}

function renderEmptyQuestionCard(){
  document.getElementById('questionText').innerText = 'Presioná START para comenzar';
  document.getElementById('optionsArea').innerHTML = '';
}

// ----------------- Marcador -----------------
function updateScoreboard(){
  const board = document.getElementById('scoreboard');
  board.innerHTML = '';
  teams.forEach((t, idx)=>{
    const div = document.createElement('div');
    div.className = 'score-item';
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="color-box" style="background: var(${t.colorClass})"></div>
        <div style="font-weight:700">${t.name}</div>
      </div>
      <div style="font-weight:800">${t.score}</div>
    `;
    board.appendChild(div);
  });
}

// ----------------- Estado por pregunta (para reabrir) ---------------
// guardamos el estado actual de la pregunta mostrada para poder reabrir la misma si se pausa
let lastQuestionState = null; // { questionObj, failedTeams:[], disabledOptionIdxs:Set(), activeTeam: number|null }

// ----------------- Flujo principal: mostrar siguiente pregunta -----------------
async function showNextQuestion(){
  if(gamePaused) return;

  if(questionsAsked >= totalQuestions){
    await Swal.fire({
      icon:'info',
      title:'Ronda finalizada',
      html:`Se mostraron ${questionsAsked} preguntas.`,
      confirmButtonText:'Aceptar'
    });
    return;
  }

  const q = pickQuestion();
  if(!q){
    await Swal.fire({ icon:'info', title:'No quedan preguntas', text:'Se terminó el juego.' });
    return;
  }

  questionsAsked++;
  document.getElementById('askedCount').innerText = questionsAsked;

  // estado inicial de la pregunta
  const state = {
    questionObj: q,
    failedTeams: [],         // indices de equipos que ya fallaron en esta pregunta
    disabledOptionIdxs: new Set(), // indices de opciones que ya fueron elegidas incorrectas
    activeTeam: null
  };
  lastQuestionState = state;
  lastQuestion = q;

  // render en pantalla principal (solo visual, opciones inactivas inicialmente)
  renderQuestionCard(q, state.disabledOptionIdxs);

  // abrir modal (Swal) con estado inicial: opciones deshabilitadas, botones de equipos disponibles
  await showQuestionModal(q, state.failedTeams, state.disabledOptionIdxs);
}

// ----------------- Render visual en la pantalla principal -----------------
function renderQuestionCard(q, disabledOptionIdxs){
  document.getElementById('questionText').innerText = q.question || '—';
  const optionsArea = document.getElementById('optionsArea');
  optionsArea.innerHTML = q.options.map((opt, i)=>{
    const cls = disabledOptionIdxs && disabledOptionIdxs.has(i) ? 'option-badge disabled' : 'option-badge';
    return `<div class="${cls}" data-idx="${i}">${String.fromCharCode(65+i)}. ${opt}</div>`;
  }).join('');
}

// ----------------- Modal que muestra pregunta y permite seleccionar equipo -----------------
/*
  Parámetros:
    q - la pregunta (obj)
    failedTeams - array de índices que ya fallaron
    disabledOptionIdxs - Set con índices de opciones ya usadas e incorrectas
*/
async function showQuestionModal(q, failedTeams = [], disabledOptionIdxs = new Set()){
  if(gamePaused) return;

  // actualizamos la vista principal también
  renderQuestionCard(q, disabledOptionIdxs);

  // lista de equipos que todavía pueden intentar
  const remainingTeams = teams.map((_, i) => i).filter(i => !failedTeams.includes(i));

  // build HTML para swal: pregunta + opciones (como bloques, pero desactivados) + area de botones de equipos (si hay >1)
  const optionsHtml = q.options.map((o, i) => {
    const disabled = disabledOptionIdxs.has(i) ? 'disabled' : '';
    return `<div class="swal-option ${disabled}" data-idx="${i}" style="background:#6b21a8;color:#FDFDEFff">${String.fromCharCode(65+i)}. ${o}</div>`;
  }).join('');

  // si solo queda un equipo, no mostramos selector de equipos (se habilitan opciones directamente)
  const showTeamButtons = remainingTeams.length > 1;

  const teamButtonsHtml = showTeamButtons
    ? remainingTeams.map(i => {
        return `<button class="swal-team" data-team="${i}" style="background: var(${teams[i].colorClass})">${teams[i].name}</button>`;
      }).join('')
    : `<div class="small text-muted">Último equipo restante: <strong>${teams[remainingTeams[0]].name}</strong></div>`;

  // Guardamos el estado actual para poder reabrir/referenciar
  lastQuestionState = { questionObj: q, failedTeams: [...failedTeams], disabledOptionIdxs: new Set([...disabledOptionIdxs]), activeTeam: null };

  // Construimos el modal
  const swalHtml = `
    <div style="text-align:left">
    ${q.image ? `<div style="text-align:center;margin-bottom:20px;">
      <img src="${q.image}" alt="question image" style="max-width:250px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.15);" />
    </div>` : ''}
      <div style="font-weight:800;margin-bottom:30px;color:#3b115c ">${escapeHtml(q.question)}</div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">${optionsHtml}</div>
      <div style="margin-top:100px;display: flex;justify-content: center"">${teamButtonsHtml}</div>
    <div class="mt-3 small text-muted">Selecciona el equipo que va a responder. Después selecciona la opción que dijeron.</div>
    </div>
  `;

  const swalResult = await Swal.fire({
    title: `Pregunta (${q.points} pts)`,
    html: swalHtml,
    width: 900,
    showConfirmButton: false,
    allowOutsideClick: false,
    showCloseButton: true,     // la X para pausar
    willClose: () => {
      // si el moderador cierra con la X, pausamos el juego y mostramos continuar
      gamePaused = true;
      document.getElementById('continueBtn').style.display = 'inline-block';
    },
    didOpen: () => {
      const container = Swal.getHtmlContainer();

      // referenciamos elementos dentro del modal
      const optionEls = container.querySelectorAll('.swal-option');
      const teamEls = container.querySelectorAll('.swal-team');

      // inicialmente las opciones deben estar INACTIVAS (moderador las habilita cuando elige equipo)
      optionEls.forEach(el => {
        el.classList.add('disabled');
      });

      // CLICK en equipo -> activa opciones para ese equipo y desactiva otros equipos
      teamEls.forEach(btn => {
        btn.addEventListener('click', () => {
          const teamIdx = parseInt(btn.dataset.team, 10);
          // actualizamos estado
          lastQuestionState.activeTeam = teamIdx;

          // marcar visualmente el equipo activo (resaltar)
          teamEls.forEach(t => t.classList.toggle('disabled', parseInt(t.dataset.team,10) !== teamIdx));

          // habilitar opciones que aún no fueron usadas
          optionEls.forEach(op => {
            const idx = parseInt(op.dataset.idx, 10);
            if(lastQuestionState.disabledOptionIdxs.has(idx)){
              op.classList.add('disabled');
            } else {
              op.classList.remove('disabled');
            }
            // los opciones habilitadas responderán al click
            op.onclick = async () => {
              if(op.classList.contains('disabled')) return;
              await processTeamAnswer(q, teamIdx, idx);
            };
          });
        });
      });

      // Caso: si solo queda 1 equipo, activamos opciones sin necesidad de click en equipo
      if(!showTeamButtons && remainingTeams.length === 1){
        const onlyTeam = remainingTeams[0];
        lastQuestionState.activeTeam = onlyTeam;
        // habilitar opciones que aún no fueron usadas
        optionEls.forEach(op => {
          const idx = parseInt(op.dataset.idx, 10);
          if(lastQuestionState.disabledOptionIdxs.has(idx)){
            op.classList.add('disabled');
          } else {
            op.classList.remove('disabled');
            op.onclick = async () => {
              await processTeamAnswer(q, onlyTeam, idx);
            };
          }
        });
      }
    }
  });

  // si el modal se cerró por X, swal returns and we paused above.
}

// ----------------- Procesar respuesta del equipo (desde modal) -----------------
/*
  q - pregunta
  teamIdx - índice del equipo que respondió
  optionIdx - índice de la opción elegida por el moderador
*/
async function processTeamAnswer(q, teamIdx, optionIdx){
  // prevenir doble click si juego pausado
  if(gamePaused) return;

  // Si ya estaba deshabilitada la opción (por intentos previos), no hacemos nada
  if(lastQuestionState.disabledOptionIdxs.has(optionIdx)) return;

  // verificar si es correcta
  const correctIdx = q.correct;

if(optionIdx === correctIdx){
  // acierto
  let pts = q.points || 1;
  teams[teamIdx].score += pts;
  updateScoreboard();
  document.getElementById('lastAction').innerText = `${teams[teamIdx].name} acertó y sumó ${pts} pts`;

  // mostrar swal de acierto con opción "Siguiente" o "X2"
  const res = await Swal.fire({
    icon: 'success',
    title: '¡Correcto!',
    html: `<div>${teams[teamIdx].name} sumó <strong>${pts} pts</strong></div>`,
    showCancelButton: true,
    confirmButtonText: 'Siguiente pregunta',
    cancelButtonText: 'X2',
    showCloseButton: false  // opcional: quitamos la X original para no confundir
  });

  if(res.isConfirmed){
    // continuar con siguiente pregunta
    lastQuestionState = null;
    if(!gamePaused) showNextQuestion();
  } else {
    // duplicar puntos
    pts *= 1;
    teams[teamIdx].score += pts; // sumamos de nuevo
    updateScoreboard();
    document.getElementById('lastAction').innerText = `${teams[teamIdx].name} duplicó puntos y sumó ${pts} adicionales`;

    // luego continuamos con siguiente pregunta
    lastQuestionState = null;
    if(!gamePaused) showNextQuestion();
  }
}else {
    // fallo del equipo: marcar equipo como fallado y marcar opción como usada (deshabilitada)
    lastQuestionState.failedTeams.push(teamIdx);
    lastQuestionState.disabledOptionIdxs.add(optionIdx);
    document.getElementById('lastAction').innerText = `${teams[teamIdx].name} falló.`;

    // Si quedan equipos que puedan intentar, reabrimos el mismo modal con el estado actualizado
    const remaining = teams.map((_,i)=>i).filter(i => !lastQuestionState.failedTeams.includes(i));
    if(remaining.length === 0){
      // todos fallaron -> mostramos respuesta correcta y siguiente pregunta
      await Swal.fire({
        icon:'info',
        title: 'Todos fallaron',
        html:`La respuesta correcta era: <strong>${escapeHtml(q.options[q.correct])}</strong>`,
        confirmButtonText: 'Siguiente pregunta',
        showCloseButton: true
      });
      lastQuestionState = null;
      if(!gamePaused) showNextQuestion();
      return;
    } else {
      // Reabrimos modal con las opciones inhabilitadas (excepto que el moderador vuelva a elegir equipo)
      // re-render en pantalla principal
      renderQuestionCard(q, lastQuestionState.disabledOptionIdxs);
      // reabrir modal si no pausa
      if(!gamePaused){
        // pequeño delay para evitar apilar swals
        setTimeout(()=> showQuestionModal(q, lastQuestionState.failedTeams, lastQuestionState.disabledOptionIdxs), 350);
      } else {
        // si se pausó, mostramos continuar
        document.getElementById('continueBtn').style.display = 'inline-block';
      }
    }
  }
}

// ----------------- Helpers -----------------
function escapeHtml(str){
  if(!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

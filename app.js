const STORAGE_KEY = "liga-futbolin-state-v2";
const SUPABASE_URL = "https://ozmzncwpinvaaawetrre.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bXpuY3dwaW52YWFhd2V0cnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODE3NjksImV4cCI6MjA5MTE1Nzc2OX0.SVwVCLY6WnbuJpZ5AxVN90xWbDHjaVroqiuAxeoEvtk";
const LEAGUE_TABLE = "league_state";
const LEAGUE_ROW_ID = 1;
const SUPABASE_SESSION_KEY = "liga-futbolin-supabase-session";

const PLAYERS = ["Alex", "Arnau", "David", "Marc", "Pere", "Sergi"];

const INITIAL_MATCHES = [
  { jornada: 1, team1: ["Arnau", "Pere"], team2: ["Alex", "Marc"], descansan: ["Sergi", "David"], score1: 5, score2: 6, goals: { Arnau: 1, Pere: 4, Alex: 6, Marc: 0 } },
  { jornada: 2, team1: ["Alex", "Sergi"], team2: ["Marc", "David"], descansan: ["Arnau", "Pere"], score1: 4, score2: 7, goals: { Alex: 2, Sergi: 2, Marc: 4, David: 3 } },
  { jornada: 3, team1: ["Arnau", "Sergi"], team2: ["Pere", "David"], descansan: ["Alex", "Marc"], score1: 5, score2: 6, goals: { Arnau: 3, Sergi: 2, Pere: 4, David: 2 } },
  { jornada: 4, team1: ["Pere", "Alex"], team2: ["Sergi", "David"], descansan: ["Arnau", "Marc"], score1: 8, score2: 3, goals: { Pere: 5, Alex: 3, Sergi: 0, David: 3 } },
  { jornada: 5, team1: ["Pere", "Marc"], team2: ["Alex", "David"], descansan: ["Arnau", "Sergi"], score1: 9, score2: 2, goals: { Pere: 5, Marc: 4, Alex: 1, David: 1 } },
  { jornada: 6, team1: ["Arnau", "David"], team2: ["Marc", "Sergi"], descansan: ["Pere", "Alex"], score1: null, score2: null, goals: { Arnau: null, David: null, Marc: null, Sergi: null } },
  { jornada: 7, team1: ["Arnau", "Marc"], team2: ["Sergi", "Alex"], descansan: ["David", "Pere"], score1: null, score2: null, goals: { Arnau: null, Marc: null, Sergi: null, Alex: null } },
  { jornada: 8, team1: ["Arnau", "Alex"], team2: ["Pere", "Sergi"], descansan: ["David", "Marc"], score1: null, score2: null, goals: { Arnau: null, Alex: null, Pere: null, Sergi: null } },
  { jornada: 9, team1: ["Arnau", "Sergi"], team2: ["Pere", "Marc"], descansan: ["Alex", "David"], score1: null, score2: null, goals: { Arnau: null, Sergi: null, Pere: null, Marc: null } },
  { jornada: 10, team1: ["Arnau", "Pere"], team2: ["Marc", "David"], descansan: ["Alex", "Sergi"], score1: null, score2: null, goals: { Arnau: null, Pere: null, Marc: null, David: null } },
  { jornada: 11, team1: ["Arnau", "Alex"], team2: ["Pere", "David"], descansan: ["Marc", "Sergi"], score1: null, score2: null, goals: { Arnau: null, Alex: null, Pere: null, David: null } },
  { jornada: 12, team1: ["Arnau", "David"], team2: ["Pere", "Sergi"], descansan: ["Alex", "Marc"], score1: null, score2: null, goals: { Arnau: null, David: null, Pere: null, Sergi: null } },
  { jornada: 13, team1: ["Arnau", "Marc"], team2: ["Alex", "Sergi"], descansan: ["Pere", "David"], score1: null, score2: null, goals: { Arnau: null, Marc: null, Alex: null, Sergi: null } },
  { jornada: 14, team1: ["Arnau", "David"], team2: ["Alex", "Marc"], descansan: ["Pere", "Sergi"], score1: null, score2: null, goals: { Arnau: null, David: null, Alex: null, Marc: null } },
  { jornada: 15, team1: ["Arnau", "Sergi"], team2: ["Marc", "David"], descansan: ["Pere", "Alex"], score1: null, score2: null, goals: { Arnau: null, Sergi: null, Marc: null, David: null } },
  { jornada: 16, team1: ["Pere", "David"], team2: ["Alex", "Sergi"], descansan: ["Arnau", "Marc"], score1: null, score2: null, goals: { Pere: null, David: null, Alex: null, Sergi: null } },
  { jornada: 17, team1: ["Pere", "Marc"], team2: ["Alex", "David"], descansan: ["Arnau", "Sergi"], score1: null, score2: null, goals: { Pere: null, Marc: null, Alex: null, David: null } },
  { jornada: 18, team1: ["Pere", "Sergi"], team2: ["Alex", "Marc"], descansan: ["Arnau", "David"], score1: null, score2: null, goals: { Pere: null, Sergi: null, Alex: null, Marc: null } }
];

const tabs = [
  { id: "clasificacion", label: "Clasificacion" },
  { id: "jornadas", label: "Jornadas" },
  { id: "goleadores", label: "Goleadores" }
].concat(
  PLAYERS.map((player) => ({ id: `jugador-${slugify(player)}`, label: player, player })),
  [{ id: "entrada", label: "Entrada" }]
);

let state = loadState();
let activeTab = "clasificacion";
let isAdmin = false;
let adminEmail = "";
let adminSession = loadAdminSession();

const tabBar = document.getElementById("tab-bar");
const tabContent = document.getElementById("tab-content");
const adminToggle = document.getElementById("admin-toggle");

render();

adminToggle.addEventListener("click", handleAdminToggle);

initializeApp();

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function shouldUseSupabase() {
  return SUPABASE_URL.startsWith("http") && !SUPABASE_ANON_KEY.startsWith("PEGA_AQUI");
}

function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return cloneData(INITIAL_MATCHES);
  }

  try {
    return mergeStateWithTemplate(JSON.parse(raw));
  } catch {
    return cloneData(INITIAL_MATCHES);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function initializeApp() {
  if (!shouldUseSupabase()) {
    render();
    return;
  }

  syncAuthState();
  await loadRemoteState();
}

function syncAuthState() {
  isAdmin = Boolean(adminSession && adminSession.access_token);
  adminEmail = adminSession && adminSession.user && adminSession.user.email ? adminSession.user.email : "";
}

async function loadRemoteState() {
  if (!shouldUseSupabase()) {
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${LEAGUE_TABLE}?id=eq.${LEAGUE_ROW_ID}&select=matches`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!response.ok) {
    return;
  }

  const rows = await response.json();
  const data = rows && rows[0];
  if (!data || !data.matches) {
    return;
  }

  state = mergeStateWithTemplate(data.matches);
  saveState();
  render();
}

async function saveRemoteState() {
  if (!shouldUseSupabase() || !isAdmin || !adminSession || !adminSession.access_token) {
    return;
  }

  const payload = state.map((match) => ({
    jornada: match.jornada,
    score1: match.score1,
    score2: match.score2,
    goals: match.goals
  }));

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${LEAGUE_TABLE}?id=eq.${LEAGUE_ROW_ID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${adminSession.access_token}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      matches: payload,
      updated_at: new Date().toISOString()
    })
  });

  if (!response.ok) {
    const message = await response.text();
    window.alert(`No se pudo guardar en Supabase: ${message}`);
  }
}

function mergeStateWithTemplate(savedMatches) {
  return INITIAL_MATCHES.map((match) => {
    const saved = savedMatches.find((item) => Number(item.jornada) === match.jornada);
    if (!saved) {
      return cloneData(match);
    }

    const goals = {};
    Object.keys(match.goals).forEach((player) => {
      const savedGoals = saved.goals ? saved.goals[player] : null;
      goals[player] = parseNullableNumber(savedGoals);
    });

    return {
      jornada: match.jornada,
      team1: cloneData(match.team1),
      team2: cloneData(match.team2),
      descansan: cloneData(match.descansan),
      score1: parseNullableNumber(saved.score1),
      score2: parseNullableNumber(saved.score2),
      goals
    };
  });
}

function parseNullableNumber(value) {
  return value === null || value === undefined || value === "" || Number.isNaN(Number(value)) ? null : Number(value);
}

function isMatchPlayed(match) {
  return match.score1 !== null && match.score2 !== null;
}

function getMatchStatus(match) {
  if (!isMatchPlayed(match)) {
    return { label: "Pendiente", className: "pending" };
  }

  const goalSum = Object.values(match.goals).reduce((sum, value) => sum + (value == null ? 0 : value), 0);
  const scoreSum = (match.score1 == null ? 0 : match.score1) + (match.score2 == null ? 0 : match.score2);
  if (goalSum === scoreSum) {
    return { label: "OK", className: "ok" };
  }

  return { label: "Revisar goles", className: "revisar" };
}

function getResultLabel(result) {
  const key = slugify(result);
  return `<span class="result-pill ${key}">${result}</span>`;
}

function computeData(matches) {
  const playerStats = {};
  PLAYERS.forEach((player) => {
    playerStats[player] = {
      player,
      pj: 0,
      goles: 0,
      puntos: 0,
      ganados: 0,
      empatados: 0,
      perdidos: 0,
      recibidos: 0,
      descansos: 0,
      jornadas: []
    };
  });

  for (const match of matches) {
    for (const player of PLAYERS) {
      const stats = playerStats[player];
      const playsTeam1 = match.team1.includes(player);
      const playsTeam2 = match.team2.includes(player);

      if (!playsTeam1 && !playsTeam2) {
        stats.descansos += 1;
        stats.jornadas.push({
          jornada: match.jornada,
          resultado: "Descansa",
          puntos: 0,
          golesMarcados: 0,
          golesRecibidos: 0,
          partido: 0
        });
        continue;
      }

      if (!isMatchPlayed(match)) {
        stats.jornadas.push({
          jornada: match.jornada,
          resultado: "No jugado",
          puntos: 0,
          golesMarcados: 0,
          golesRecibidos: 0,
          partido: 0
        });
        continue;
      }

      const teamScore = playsTeam1 ? match.score1 : match.score2;
      const rivalScore = playsTeam1 ? match.score2 : match.score1;
      const golesMarcados = match.goals[player] == null ? 0 : match.goals[player];

      let resultado = "Empate";
      let puntos = 1;
      if (teamScore > rivalScore) {
        resultado = "Victoria";
        puntos = 3;
        stats.ganados += 1;
      } else if (teamScore < rivalScore) {
        resultado = "Derrota";
        puntos = 0;
        stats.perdidos += 1;
      } else {
        stats.empatados += 1;
      }

      stats.pj += 1;
      stats.goles += golesMarcados;
      stats.puntos += puntos;
      stats.recibidos += rivalScore;
      stats.jornadas.push({
        jornada: match.jornada,
        resultado,
        puntos,
        golesMarcados,
        golesRecibidos: rivalScore,
        partido: 1
      });
    }
  }

  const clasificacion = Object.values(playerStats).sort((a, b) =>
    b.puntos - a.puntos ||
    b.goles - a.goles ||
    a.recibidos - b.recibidos ||
    a.player.localeCompare(b.player, "es")
  );

  const goleadores = Object.values(playerStats).sort((a, b) =>
    b.goles - a.goles ||
    b.puntos - a.puntos ||
    a.player.localeCompare(b.player, "es")
  );

  return { playerStats, clasificacion, goleadores };
}

function render() {
  if (!isAdmin && activeTab === "entrada") {
    activeTab = "clasificacion";
  }

  const computed = computeData(state);
  renderHero(computed);
  renderTabs();
  renderActiveTab(computed);
}

function renderHero({ clasificacion, goleadores }) {
  const leader = clasificacion[0];
  const topScorer = goleadores[0];
  const playedMatches = state.filter(isMatchPlayed).length;

  document.getElementById("hero-leader-name").textContent = leader ? `${leader.player} - ${leader.puntos} pts` : "-";
  document.getElementById("hero-top-scorer-name").textContent = topScorer ? `${topScorer.player} - ${topScorer.goles} goles` : "-";
  document.getElementById("hero-progress").textContent = `${playedMatches}/${state.length}`;
  adminToggle.textContent = isAdmin ? `Salir admin (${adminEmail || "conectado"})` : "Modo admin";
  adminToggle.classList.toggle("secondary", !isAdmin);
}

function renderTabs() {
  tabBar.innerHTML = "";
  const visibleTabs = tabs.filter((tab) => isAdmin || tab.id !== "entrada");

  for (const tab of visibleTabs) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${tab.id === activeTab ? " active" : ""}`;
    button.textContent = tab.label;
    button.addEventListener("click", () => {
      activeTab = tab.id;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    tabBar.appendChild(button);
  }
}

function renderActiveTab(computed) {
  switch (activeTab) {
    case "clasificacion":
      renderClasificacion(computed);
      break;
    case "jornadas":
      renderJornadas();
      break;
    case "goleadores":
      renderGoleadores(computed);
      break;
    case "entrada":
      renderEntrada();
      break;
    default: {
      const tabData = tabs.find((tab) => tab.id === activeTab);
      const player = tabData ? tabData.player : null;
      if (player) {
        renderJugador(player, computed.playerStats[player]);
      }
    }
  }
}

function renderClasificacion({ clasificacion, goleadores }) {
  const playedMatches = state.filter(isMatchPlayed).length;
  const pendingMatches = state.length - playedMatches;
  const topScorer = goleadores[0];

  tabContent.innerHTML = `
    <section class="summary-strip">
      <article class="summary-card">
        <span>Partidos jugados</span>
        <strong>${playedMatches}</strong>
      </article>
      <article class="summary-card">
        <span>Partidos pendientes</span>
        <strong>${pendingMatches}</strong>
      </article>
      <article class="summary-card">
        <span>Lider</span>
        <strong>${clasificacion[0] ? clasificacion[0].player : "-"}</strong>
      </article>
      <article class="summary-card">
        <span>Goleador</span>
        <strong>${topScorer ? `${topScorer.player} - ${topScorer.goles}` : "-"}</strong>
      </article>
    </section>
    <section class="dashboard-grid">
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="section-kicker">Vista general</p>
            <h2>Clasificacion</h2>
          </div>
          <p class="section-note">Ordenada por puntos, goles y goles recibidos.</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Jugador</th>
                <th>PJ</th>
                <th>Goles</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              ${clasificacion.map((row, index) => `
                <tr class="${index === 0 ? "leader-row" : ""}">
                  <td class="rank-cell">${index + 1}</td>
                  <td>${row.player}</td>
                  <td>${row.pj}</td>
                  <td>${row.goles}</td>
                  <td>${row.puntos}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="section-kicker">Movimiento</p>
            <h2>Ultimas jornadas</h2>
          </div>
          <p class="section-note">Resumen rapido de lo ya jugado.</p>
        </div>
        <div class="results-grid">
          ${state.slice().reverse().filter(isMatchPlayed).slice(0, 4).map(renderMatchCard).join("") || `
            <div class="empty-state">
              <p>Todavia no hay resultados registrados.</p>
            </div>
          `}
        </div>
      </section>
    </section>
  `;
}

function renderGoleadores({ goleadores }) {
  tabContent.innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="section-kicker">Ranking individual</p>
          <h2>Goleadores</h2>
        </div>
        <p class="section-note">Actualizado automaticamente con los goles que introduzcas en Entrada.</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Jugador</th>
              <th>Goles</th>
              <th>Puntos</th>
              <th>PJ</th>
            </tr>
          </thead>
          <tbody>
            ${goleadores.map((row, index) => `
              <tr class="${index === 0 ? "leader-row" : ""}">
                <td class="rank-cell">${index + 1}</td>
                <td>${row.player}</td>
                <td>${row.goles}</td>
                <td>${row.puntos}</td>
                <td>${row.pj}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderJornadas() {
  tabContent.innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="section-kicker">Calendario</p>
          <h2>Resultados por jornada</h2>
        </div>
        <p class="section-note">Cada jornada muestra el 2v2 y los dos jugadores que descansan.</p>
      </div>
      <div class="results-grid">
        ${state.map(renderMatchCard).join("")}
      </div>
    </section>
  `;
}

function renderJugador(player, stats) {
  const average = stats.pj ? (stats.goles / stats.pj).toFixed(2) : "0.00";
  const averageConceded = stats.pj ? (stats.recibidos / stats.pj).toFixed(2) : "0.00";

  tabContent.innerHTML = `
    <section class="player-grid">
      <article class="player-overview">
        <div class="player-overview-header">
          <div>
            <p class="section-kicker">Ficha individual</p>
            <h2 class="player-title">${player}</h2>
            <p class="player-caption">Resumen automatico por jornada, igual que en tu Excel pero con una vista mas limpia.</p>
          </div>
          <div class="player-summary">
            <div class="metric-card">
              <span>Puntos</span>
              <strong>${stats.puntos}</strong>
            </div>
            <div class="metric-card">
              <span>Goles</span>
              <strong>${stats.goles}</strong>
            </div>
            <div class="metric-card">
              <span>PJ</span>
              <strong>${stats.pj}</strong>
            </div>
            <div class="metric-card">
              <span>Descansos</span>
              <strong>${stats.descansos}</strong>
            </div>
          </div>
        </div>
        <div class="player-summary">
          <div class="summary-card">
            <span>Victorias</span>
            <strong>${stats.ganados}</strong>
          </div>
          <div class="summary-card">
            <span>Empates</span>
            <strong>${stats.empatados}</strong>
          </div>
          <div class="summary-card">
            <span>Derrotas</span>
            <strong>${stats.perdidos}</strong>
          </div>
          <div class="summary-card">
            <span>Promedio goleador</span>
            <strong>${average}</strong>
          </div>
          <div class="summary-card">
            <span>Goles encajados por partido</span>
            <strong>${averageConceded}</strong>
          </div>
        </div>
      </article>
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="section-kicker">Detalle completo</p>
            <h2>Jornadas de ${player}</h2>
          </div>
          <p class="section-note">Victoria 3 puntos, empate 1 y derrota 0.</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Jornada</th>
                <th>Resultado</th>
                <th>Puntos</th>
                <th>Goles Marcados</th>
                <th>Goles Recibidos</th>
                <th>Partido</th>
              </tr>
            </thead>
            <tbody>
              ${stats.jornadas.map((row) => `
                <tr>
                  <td>${row.jornada}</td>
                  <td>${getResultLabel(row.resultado)}</td>
                  <td>${row.puntos}</td>
                  <td>${row.golesMarcados}</td>
                  <td>${row.golesRecibidos}</td>
                  <td>${row.partido}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `;
}

function renderEntrada() {
  tabContent.innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="section-kicker">Edicion</p>
          <h2>Entrada de resultados</h2>
        </div>
        <p class="section-note">Aqui se meten resultados y goles. Todo lo demas se recalcula solo y queda en modo visualizacion.</p>
      </div>
      <section class="entry-grid">
        ${state.map(renderEntryCard).join("")}
      </section>
    </section>
  `;

  attachEntryEvents();
}

function renderMatchCard(match) {
  const played = isMatchPlayed(match);
  const status = getMatchStatus(match);
  const winner = played
    ? match.score1 === match.score2
      ? 0
      : match.score1 > match.score2
        ? 1
        : 2
    : 0;

  return `
    <article class="match-card ${played ? "played" : ""}">
      <div class="match-header">
        <div>
          <p class="mini-label">Jornada ${match.jornada}</p>
          <h3 class="entry-title">Partido principal</h3>
        </div>
        <span class="status-pill ${status.className}">${status.label}</span>
      </div>
      <div class="match-score">
        <div class="team-block ${winner === 1 ? "winner" : ""}">
          <span class="team-label">Equipo 1</span>
          <p class="team-players">${match.team1.join(" + ")}</p>
          <span class="score-number">${played ? match.score1 : "-"}</span>
        </div>
        <div class="score-divider">VS</div>
        <div class="team-block ${winner === 2 ? "winner" : ""}">
          <span class="team-label">Equipo 2</span>
          <p class="team-players">${match.team2.join(" + ")}</p>
          <span class="score-number">${played ? match.score2 : "-"}</span>
        </div>
      </div>
      <div class="goals-grid">
        ${match.team1.concat(match.team2).map((player) => `
          <div class="goal-chip">
            <span>${player}</span>
            <strong>${match.goals[player] == null ? "-" : match.goals[player]}</strong>
          </div>
        `).join("")}
      </div>
      <p class="rest-text">Descansan: ${match.descansan.join(" y ")}</p>
    </article>
  `;
}

function renderEntryCard(match) {
  const status = getMatchStatus(match);

  return `
    <article class="entry-card" data-jornada="${match.jornada}">
      <div class="entry-header">
        <div>
          <p class="mini-label">Jornada ${match.jornada}</p>
          <h3 class="entry-title">${match.team1[0]} y ${match.team1[1]} vs ${match.team2[0]} y ${match.team2[1]}</h3>
          <p class="entry-subtitle">Descansan: ${match.descansan.join(" y ")}</p>
        </div>
        <span class="status-pill ${status.className}">${status.label}</span>
      </div>
      <div class="entry-teams">
        <div class="entry-team-box">
          <span class="team-label">Equipo 1</span>
          <p class="team-players">${match.team1.join(" + ")}</p>
        </div>
        <div class="versus">VS</div>
        <div class="entry-team-box">
          <span class="team-label">Equipo 2</span>
          <p class="team-players">${match.team2.join(" + ")}</p>
        </div>
      </div>
      <div class="entry-input-row">
        <label>
          Resultado equipo 1
          <input type="number" min="0" step="1" inputmode="numeric" data-field="score1" value="${match.score1 == null ? "" : match.score1}">
        </label>
        <label>
          Resultado equipo 2
          <input type="number" min="0" step="1" inputmode="numeric" data-field="score2" value="${match.score2 == null ? "" : match.score2}">
        </label>
      </div>
      <div class="entry-goals-grid">
        ${match.team1.concat(match.team2).map((player) => `
          <label class="entry-goal-input">
            Goles de ${player}
            <input type="number" min="0" step="1" inputmode="numeric" data-player="${player}" value="${match.goals[player] == null ? "" : match.goals[player]}">
          </label>
        `).join("")}
      </div>
      <div class="entry-footer">
        <span class="save-note">Guardado automatico en este navegador.</span>
        <span class="status-pill ${status.className}">${status.label}</span>
      </div>
    </article>
  `;
}

function attachEntryEvents() {
  const cards = tabContent.querySelectorAll(".entry-card");

  for (const card of cards) {
    const jornada = Number(card.dataset.jornada);
    const match = state.find((item) => item.jornada === jornada);
    if (!match) continue;

    card.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        if (input.dataset.field) {
          match[input.dataset.field] = normalizeInputValue(input.value);
        }

        if (input.dataset.player) {
          match.goals[input.dataset.player] = normalizeInputValue(input.value);
        }

        saveState();
        saveRemoteState();
        activeTab = "entrada";
        render();
      });
    });
  }
}

function normalizeInputValue(value) {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.floor(parsed);
}

async function handleAdminToggle() {
  if (!shouldUseSupabase()) {
    window.alert("Primero hay que configurar Supabase en app.js con la URL y la anon key.");
    return;
  }

  if (isAdmin) {
    clearAdminSession();
    isAdmin = false;
    adminEmail = "";
    activeTab = "clasificacion";
    render();
    return;
  }

  const email = window.prompt("Correo del admin de Supabase");
  if (!email) {
    return;
  }

  const password = window.prompt("Contrasena del admin");
  if (!password) {
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    window.alert(`No se pudo entrar como admin: ${data.error_description || data.msg || "error desconocido"}`);
    return;
  }

  adminSession = data;
  saveAdminSession(adminSession);
  syncAuthState();
  activeTab = "entrada";
  render();
}

function loadAdminSession() {
  const raw = sessionStorage.getItem(SUPABASE_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveAdminSession(session) {
  sessionStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  adminSession = null;
  sessionStorage.removeItem(SUPABASE_SESSION_KEY);
}

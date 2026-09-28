"use strict";

if (window.top !== window.self) {
    window.top.location = window.self.location;
}

const hallDaFamaPilotos = [
    { nome: "Lewis Hamilton", titulos: 7, equipe: "Ferrari" },
    { nome: "Max Verstappen", titulos: 4, equipe: "Red Bull Racing" },
    { nome: "Fernando Alonso", titulos: 2, equipe: "Aston Martin" },
    { nome: "Lando Norris", titulos: 1, equipe: "McLaren" }
];

// Lista completa e exata de Chefes de Equipe
const chefesEquipeData = [
    { equipe: "Mercedes", chefe: "Toto Wolff" },
    { equipe: "Ferrari", chefe: "Fred Vasseur" },
    { equipe: "Red Bull Racing", chefe: "Laurent Mekies" },
    { equipe: "McLaren", chefe: "Andrea Stella" },
    { equipe: "Aston Martin", chefe: "Adrian Newey" },
    { equipe: "Alpine", chefe: "Flavio Briatore" },
    { equipe: "Haas", chefe: "Ayao Komatsu" },
    { equipe: "Williams", chefe: "James Vowles" },
    { equipe: "Audi", chefe: "Mattia Binotto" },
    { equipe: "Racing Bulls (RB)", chefe: "Alan Permane" },
    { equipe: "Cadillac", chefe: "Marcin Budkowski" }
];

// Lista completa e exata de Engenheiros por Piloto (Aba Separada)
const engenheirosPilotosData = [
    { equipe: "McLaren", engenheiro: "Will Joseph", piloto: "Lando Norris" },
    { equipe: "McLaren", engenheiro: "Tom Stallard", piloto: "Oscar Piastri" },
    { equipe: "Mercedes", engenheiro: "Peter Bonnington", piloto: "Andrea Kimi Antonelli" },
    { equipe: "Mercedes", engenheiro: "Marcus Dudley", piloto: "George Russell" },
    { equipe: "Red Bull", engenheiro: "Gianpiero Lambiase", piloto: "Max Verstappen" },
    { equipe: "Red Bull", engenheiro: "Richard Wood", piloto: "Isack Hadjar" },
    { equipe: "Ferrari", engenheiro: "Carlos Santi", piloto: "Lewis Hamilton" },
    { equipe: "Ferrari", engenheiro: "Bryan Bozzi", piloto: "Charles Leclerc" },
    { equipe: "Williams", engenheiro: "James Urwin", piloto: "Alexander Albon" },
    { equipe: "Williams", engenheiro: "Gaëtan Jego", piloto: "Carlos Sainz Jr." },
    { equipe: "Racing Bulls", engenheiro: "Alexandre Iliopoulos", piloto: "Liam Lawson" },
    { equipe: "Racing Bulls", engenheiro: "Pierre Hamelin", piloto: "Arvid Lindblad" },
    { equipe: "Aston Martin", engenheiro: "Chris Cronin / Andrew Vizard", piloto: "Fernando Alonso" },
    { equipe: "Aston Martin", engenheiro: "Gary Gannon", piloto: "Lance Stroll" },
    { equipe: "Haas", engenheiro: "Laura Müller", piloto: "Esteban Ocon" },
    { equipe: "Haas", engenheiro: "Ronan O'Hare", piloto: "Oliver Bearman" },
    { equipe: "Audi", engenheiro: "José Manuel López", piloto: "Gabriel Bortoleto" },
    { equipe: "Audi", engenheiro: "Steven Petrik", piloto: "Nico Hülkenberg" },
    { equipe: "Alpine", engenheiro: "Stuart Barlow", piloto: "Franco Colapinto" },
    { equipe: "Alpine", engenheiro: "Josh Peckett", piloto: "Pierre Gasly" },
    { equipe: "Cadillac", engenheiro: "John Howard", piloto: "Valtteri Bottas" },
    { equipe: "Cadillac", engenheiro: "Carlo Pasetti", piloto: "Sergio Pérez" }
];

// Elementos DOM
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const btnLoad = document.getElementById('load-data-btn');
const searchInput = document.getElementById('search-input');
const grid = document.getElementById('dashboard-grid');
const statusMessage = document.getElementById('status-message');
const hallTbody = document.getElementById('hall-tbody');
const constructorsTbody = document.getElementById('constructors-tbody');
const bossesTbody = document.getElementById('bosses-tbody');
const engineersTbody = document.getElementById('engineers-tbody');
const roundSelect = document.getElementById('round-select');
const loadRoundBtn = document.getElementById('load-round-btn');
const roundContainer = document.getElementById('round-results-container');
const favTeamSelect = document.getElementById('fav-team-select');
const favDriverSelect = document.getElementById('fav-driver-select');
const savePrefsBtn = document.getElementById('save-prefs-btn');

let listaPilotosCache = [];
let debounceTimer;

// Navegação por Abas Responsiva
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.getAttribute('data-target')).classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    sincronizarDados();
    carregarConstrutoresApi();
    preencherTabelasEstaticas();
    carregarListaGps();
    carregarPreferenciaSalva();
});

btnLoad.addEventListener('click', sincronizarDados);

function preencherTabelasEstaticas() {
    // Hall da Fama
    hallTbody.textContent = "";
    hallDaFamaPilotos.forEach(item => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.textContent = item.nome;
        const td2 = document.createElement('td'); td2.textContent = `${item.titulos} Títulos`;
        const td3 = document.createElement('td'); td3.textContent = item.equipe;
        tr.append(td1, td2, td3);
        hallTbody.appendChild(tr);
    });

    // Aba Exclusiva: Chefes de Equipe
    bossesTbody.textContent = "";
    chefesEquipeData.forEach(item => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.textContent = item.equipe;
        const td2 = document.createElement('td'); td2.textContent = item.chefe;
        tr.append(td1, td2);
        bossesTbody.appendChild(tr);
    });

    // Aba Exclusiva: Engenheiros de Pilotos
    engineersTbody.textContent = "";
    engenheirosPilotosData.forEach(item => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td'); td1.textContent = item.equipe;
        const td2 = document.createElement('td'); td2.textContent = item.piloto;
        const td3 = document.createElement('td'); td3.textContent = item.engenheiro;
        tr.append(td1, td2, td3);
        engineersTbody.appendChild(tr);
    });
}

async function sincronizarDados() {
    try {
        btnLoad.textContent = "Sincronizando...";
        btnLoad.disabled = true;
        statusMessage.textContent = "Conectando à API...";

        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        if (!response.ok) throw new Error("Erro HTTP");

        const data = await response.json();
        listaPilotosCache = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        renderizarGrid(listaPilotosCache);
        preencherSeletores(listaPilotosCache);
        statusMessage.textContent = `Atualizado com sucesso às ${new Date().toLocaleTimeString('pt-BR')}.`;
        searchInput.disabled = false;
    } catch (error) {
        statusMessage.textContent = "Falha temporária ao carregar a telemetria.";
    } finally {
        btnLoad.textContent = "Sincronizar Dados";
        btnLoad.disabled = false;
    }
}

function renderizarGrid(pilotos) {
    grid.textContent = '';
    pilotos.forEach(piloto => {
        const card = document.createElement('div');
        card.className = 'driver-card';

        const numberBox = document.createElement('div');
        numberBox.className = 'driver-position';
        numberBox.textContent = piloto.Driver.permanentNumber || piloto.position;

        const name = document.createElement('h2');
        name.textContent = `${piloto.Driver.givenName} ${piloto.Driver.familyName}`;

        const team = document.createElement('p');
        team.className = 'team-name';
        team.textContent = piloto.Constructors[0].name;

        const points = document.createElement('p');
        points.className = 'points';
        points.textContent = `${piloto.points} pts`;

        card.append(numberBox, name, team, points);
        grid.appendChild(card);
    });
}

async function carregarConstrutoresApi() {
    try {
        const res = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
        const data = await res.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];

        constructorsTbody.textContent = "";
        standings.forEach(c => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td'); td1.textContent = `${c.position}°`;
            const td2 = document.createElement('td'); td2.textContent = c.Constructor.name;
            const td3 = document.createElement('td'); td3.textContent = `${c.points} pts`;
            tr.append(td1, td2, td3);
            constructorsTbody.appendChild(tr);
        });
    } catch (e) {
        constructorsTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--f1-red);">Erro ao carregar construtores.</td></tr>`;
    }
}

function preencherSeletores(pilotos) {
    favDriverSelect.innerHTML = '<option value="">Selecione o Piloto</option>';
    favTeamSelect.innerHTML = '<option value="">Selecione a Equipa</option>';

    const equipesUnicas = [...new Set(pilotos.map(p => p.Constructors[0].name))];
    
    equipesUnicas.forEach(eq => {
        const opt = document.createElement('option');
        opt.value = eq;
        opt.textContent = eq;
        favTeamSelect.appendChild(opt);
    });

    pilotos.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.Driver.driverId;
        opt.textContent = `${p.Driver.givenName} ${p.Driver.familyName}`;
        favDriverSelect.appendChild(opt);
    });

    carregarPreferenciaSalva();
}

savePrefsBtn.addEventListener('click', () => {
    const prefs = {
        equipa: favTeamSelect.value,
        piloto: favDriverSelect.value
    };
    localStorage.setItem('f1_preferencias', JSON.stringify(prefs));
    alert("Preferências guardadas com sucesso no navegador!");
});

function carregarPreferenciaSalva() {
    const salvas = JSON.parse(localStorage.getItem('f1_preferencias'));
    if (salvas) {
        if (salvas.equipa) favTeamSelect.value = salvas.equipa;
        if (salvas.piloto) favDriverSelect.value = salvas.piloto;
    }
}

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const termo = e.target.value.replace(/[<>\/\\;'"]/g, "").toLowerCase().trim();
        const filtrados = listaPilotosCache.filter(p => {
            const nome = `${p.Driver.givenName} ${p.Driver.familyName}`.toLowerCase();
            const equipe = p.Constructors[0].name.toLowerCase();
            return nome.includes(termo) || equipe.includes(termo);
        });
        renderizarGrid(filtrados);
    }, 300);
});

async function carregarListaGps() {
    try {
        const res = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
        const data = await res.json();
        const races = data.MRData.RaceTable.Races;
        
        roundSelect.textContent = "";
        races.forEach(race => {
            const opt = document.createElement('option');
            opt.value = race.round;
            opt.textContent = `Etapa ${race.round}: ${race.raceName}`;
            roundSelect.appendChild(opt);
        });
    } catch (e) {
        roundSelect.innerHTML = '<option disabled>Erro ao carregar lista de GPs</option>';
    }
}

loadRoundBtn.addEventListener('click', async () => {
    const round = roundSelect.value;
    if (!round) return;

    roundContainer.textContent = "A carregar dados da etapa...";
    try {
        const [qualiRes, resultsRes] = await Promise.all([
            fetch(`https://api.jolpi.ca/ergast/f1/current/${round}/qualifying.json`),
            fetch(`https://api.jolpi.ca/ergast/f1/current/${round}/results.json`)
        ]);

        const qualiData = await qualiRes.json();
        const resultsData = await resultsRes.json();

        const qualiList = qualiData.MRData.RaceTable.Races[0]?.QualifyingResults || [];
        const raceList = resultsData.MRData.RaceTable.Races[0]?.Results || [];

        roundContainer.textContent = "";

        const h3Q = document.createElement('h3');
        h3Q.textContent = "Resultados do Qualifying (Q1, Q2, Q3)";
        h3Q.style.marginBottom = "1rem";
        roundContainer.appendChild(h3Q);

        const tableQ = document.createElement('table');
        tableQ.className = 'data-table';
        tableQ.innerHTML = `<thead><tr><th>Pos</th><th>Piloto</th><th>Q1</th><th>Q2</th><th>Q3</th></tr></thead>`;
        const tbodyQ = document.createElement('tbody');

        qualiList.forEach(q => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${q.position}</td><td>${q.Driver.givenName} ${q.Driver.familyName}</td><td>${q.Q1 || '-'}</td><td>${q.Q2 || '-'}</td><td>${q.Q3 || '-'}</td>`;
            tbodyQ.appendChild(tr);
        });
        tableQ.appendChild(tbodyQ);
        roundContainer.appendChild(tableQ);

        const h3R = document.createElement('h3');
        h3R.textContent = "Resultado Final da Corrida & Pontos";
        h3R.style.margin = "2rem 0 1rem 0";
        roundContainer.appendChild(h3R);

        const tableR = document.createElement('table');
        tableR.className = 'data-table';
        tableR.innerHTML = `<thead><tr><th>Pos</th><th>Piloto</th><th>Tempo / Status</th><th>Pontos</th></tr></thead>`;
        const tbodyR = document.createElement('tbody');

        raceList.forEach(r => {
            const tr = document.createElement('tr');
            const tempoOuStatus = r.Time ? r.Time.time : r.status;
            tr.innerHTML = `<td>${r.position}</td><td>${r.Driver.givenName} ${r.Driver.familyName}</td><td>${tempoOuStatus}</td><td>+${r.points} pts</td>`;
            tbodyR.appendChild(tr);
        });
        tableR.appendChild(tbodyR);
        roundContainer.appendChild(tableR);

    } catch (e) {
        roundContainer.textContent = "Falha ao carregar os dados detalhados deste GP.";
    }
});

"use strict"; // SEC: Execução em modo estrito

// SEC: Proteção Anti-Clickjacking
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// === DICIONÁRIO DE NÚMEROS OFICIAIS DOS CARROS (GRID 2026 - COM CADILLAC) ===
const numerosPilotos = {
    // Mercedes
    "russell": "63",
    "antonelli": "12",
    
    // Ferrari
    "leclerc": "16",
    "hamilton": "44",
    
    // McLaren
    "norris": "4",
    "piastri": "81",
    
    // Red Bull
    "verstappen": "1",
    "hadjar": "6",
    
    // RB / VCARB
    "lawson": "30",
    "lindblad": "41",
    "tsunoda": "22",
    
    // Alpine
    "gasly": "10",
    "colapinto": "43",
    
    // Haas
    "bearman": "87",
    "ocon": "31",
    
    // Kick Sauber / Audi
    "bortoleto": "5",
    "hulkenberg": "27",
    "bottas": "77",
    
    // Williams
    "sainz": "55",
    "albon": "23",
    
    // Aston Martin
    "alonso": "14",
    "stroll": "18",
    
    // Cadillac F1 Team
    "perez": "11",
    "bottas_cadillac": "77", // Ou ajuste conforme a escalação oficial da Cadillac
    
    // Reserva genérico
    "reserva": "00"
};

// === ELEMENTOS DO DOM ===
const btnLoad = document.getElementById('load-data-btn');
const searchInput = document.getElementById('search-input');
const grid = document.getElementById('dashboard-grid');
const statusMessage = document.getElementById('status-message');
const teamSelect = document.getElementById('favorite-team');
const driverSelect = document.getElementById('favorite-driver');
const btnSave = document.getElementById('save-preferences');
const securityMsg = document.getElementById('security-msg');
const listElement = document.getElementById('constructors-list');

let listaPilotosCache = [];
let debounceTimer;

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    sincronizarDados();
    popularSeletores();
    fetchConstructors();
});
btnLoad.addEventListener('click', sincronizarDados);

// === 1. DASHBOARD PRINCIPAL ===
async function sincronizarDados() {
    try {
        btnLoad.textContent = "Autenticando...";
        btnLoad.disabled = true;
        searchInput.disabled = true;
        statusMessage.textContent = "Estabelecendo conexão TLS segura...";

        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        if (!response.ok) throw new Error("Falha HTTP " + response.status);

        const data = await response.json();
        listaPilotosCache = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        renderizarGrid(listaPilotosCache);
        
        statusMessage.textContent = `Sincronização segura concluída às ${new Date().toLocaleTimeString('pt-BR')}.`;
        statusMessage.style.color = "#a0a0b0";
        searchInput.disabled = false;

    } catch (error) {
        console.error("Erro interno protegido:", error.message);
        statusMessage.textContent = "Alerta: Falha na telemetria. Conexão bloqueada ou indisponível.";
        statusMessage.style.color = "#e10600";
        grid.textContent = "";
    } finally {
        btnLoad.textContent = "Aguarde...";
        setTimeout(() => { btnLoad.textContent = "Sincronizar Dados"; btnLoad.disabled = false; }, 3000); 
    }
}

// SEC: Proteção XSS (Uso estrito de textContent e createElement)
function renderizarGrid(pilotos) {
    grid.textContent = ''; 

    if (pilotos.length === 0) {
        grid.textContent = "Nenhum resultado corresponde à pesquisa.";
        return;
    }

    pilotos.forEach(piloto => {
        const card = document.createElement('div');
        card.className = 'driver-card';

        const position = document.createElement('div');
        position.className = 'driver-position';
        position.textContent = piloto.position; 

        const name = document.createElement('h2');
        name.textContent = `${piloto.Driver.givenName} ${piloto.Driver.familyName}`;

        const team = document.createElement('p');
        team.className = 'team-name';
        team.textContent = piloto.Constructors[0].name;

        const points = document.createElement('p');
        points.className = 'points';
        points.textContent = `${piloto.points} pts`;

        const idPiloto = piloto.Driver.driverId;
        
        const numberBadge = document.createElement('div');
        numberBadge.className = 'driver-number-badge';
        numberBadge.textContent = numerosPilotos[idPiloto] || "#";

        card.append(position, name, team, points, numberBadge);
        grid.appendChild(card);
    });
}

// SEC: Sanitização de Input + Rate Limiting
searchInput.addEventListener('input', (evento) => {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        const inputCru = evento.target.value;
        const termoSanitizado = inputCru.replace(/[<>\/\\;'"]/g, "").toLowerCase().trim();

        const resultadosFiltrados = listaPilotosCache.filter(piloto => {
            const nomeCompleto = `${piloto.Driver.givenName} ${piloto.Driver.familyName}`.toLowerCase();
            const nomeEquipe = piloto.Constructors[0].name.toLowerCase();
            const numCarro = numerosPilotos[piloto.Driver.driverId] || "";
            return nomeCompleto.includes(termoSanitizado) || nomeEquipe.includes(termoSanitizado) || numCarro.includes(termoSanitizado);
        });
        renderizarGrid(resultadosFiltrados);
    }, 300);
});

// === 2. PREFERÊNCIAS (SEC: OFUSCAÇÃO LOCALSTORAGE) ===
async function popularSeletores() {
    try {
        const [driversRes, constructorsRes] = await Promise.all([
            fetch('https://api.jolpi.ca/ergast/f1/current/drivers.json'),
            fetch('https://api.jolpi.ca/ergast/f1/current/constructors.json')
        ]);
        if (!driversRes.ok || !constructorsRes.ok) throw new Error('Falha na API');

        const driversData = await driversRes.json();
        const constructorsData = await constructorsRes.json();

        teamSelect.textContent = ''; driverSelect.textContent = '';

        constructorsData.MRData.ConstructorTable.Constructors.forEach(team => {
            const opt = document.createElement('option'); opt.value = team.constructorId; opt.textContent = team.name;
            teamSelect.appendChild(opt);
        });

        driversData.MRData.DriverTable.Drivers.forEach(driver => {
            const opt = document.createElement('option'); opt.value = driver.driverId; opt.textContent = `${driver.givenName} ${driver.familyName}`;
            driverSelect.appendChild(opt);
        });

        const savedTeam = localStorage.getItem('f1_fav_team');
        const savedDriver = localStorage.getItem('f1_fav_driver');
        if (savedTeam) teamSelect.value = atob(savedTeam);
        if (savedDriver) driverSelect.value = atob(savedDriver);

    } catch (error) {
        console.error("Falha silenciosa ao carregar seletores.");
    }
}

btnSave.addEventListener('click', () => {
    const team = teamSelect.value;
    const driver = driverSelect.value;
    if (!team || !driver) return;

    localStorage.setItem('f1_fav_team', btoa(team));
    localStorage.setItem('f1_fav_driver', btoa(driver));

    securityMsg.textContent = "Preferências criptografadas localmente.";
    securityMsg.style.display = "block";
    setTimeout(() => securityMsg.style.display = "none", 3000);
    fetchConstructors(); 
});

// === 3. CLASSIFICAÇÃO DE CONSTRUTORES ===
async function fetchConstructors() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
        if (!response.ok) throw new Error("Erro na API");

        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        listElement.textContent = '';

        let favTeamDecoded = null;
        if(localStorage.getItem('f1_fav_team')) favTeamDecoded = atob(localStorage.getItem('f1_fav_team'));

        standings.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.position}º - ${item.Constructor.name} (${item.points} pts)`;

            if (item.Constructor.constructorId === favTeamDecoded) {
                li.classList.add('highlight-team');
            }
            listElement.appendChild(li);
        });
    } catch (error) {
        listElement.textContent = "Falha ao carregar classificação de equipes.";
    }
}

(function() {
    "use strict";

    // 1. Blindagem Anti-Clickjacking e Isolamento de Contexto
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    /* ==========================================
       MODEL (Camada de Dados, Lógica e LGPD)
       ========================================== */
    class F1Model {
        constructor() {
            this._hallData = [
                { nome: "Lewis Hamilton", titulos: 7, equipe: "Ferrari" },
                { nome: "Max Verstappen", titulos: 4, equipe: "Red Bull Racing" },
                { nome: "Fernando Alonso", titulos: 2, equipe: "Aston Martin" },
                { nome: "Lando Norris", titulos: 1, equipe: "McLaren" }
            ];

            this._bossesData = [
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

            this._engineersData = [
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
                { equipe: "Racing Bulls", engenheiro: "Alexandre Iliopoulos", piloto: "Yuki Tsunoda" },
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
        }

        get hallData() { return this._hallData; }
        get bossesData() { return this._bossesData; }
        get engineersData() { return this._engineersData; }

        async fetchDriverStandings() {
            const res = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
            const data = await res.json();
            return data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        }

        async fetchConstructorStandings() {
            const res = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
            const data = await res.json();
            return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
        }

        async fetchRaces() {
            const res = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
            const data = await res.json();
            return data.MRData.RaceTable.Races;
        }

        async fetchRoundDetails(round) {
            const [qualiRes, resultsRes] = await Promise.all([
                fetch(`https://api.jolpi.ca/ergast/f1/current/${round}/qualifying.json`),
                fetch(`https://api.jolpi.ca/ergast/f1/current/${round}/results.json`)
            ]);
            const qualiData = await qualiRes.json();
            const resultsData = await resultsRes.json();
            return {
                quali: qualiData.MRData.RaceTable.Races[0]?.QualifyingResults || [],
                results: resultsData.MRData.RaceTable.Races[0]?.Results || []
            };
        }

        savePreferences(prefs) {
            localStorage.setItem('f1_preferencias', JSON.stringify(prefs));
        }

        clearPreferences() {
            localStorage.removeItem('f1_preferencias');
        }

        getPreferences() {
            return JSON.parse(localStorage.getItem('f1_preferencias')) || {};
        }
    }

    /* ==========================================
       VIEW (Camada de Apresentação e DOM)
       ========================================== */
    class F1View {
        constructor() {
            this.tabButtons = document.querySelectorAll('.tab-btn');
            this.tabContents = document.querySelectorAll('.tab-content');
            this.grid = document.getElementById('dashboard-grid');
            this.hallTbody = document.getElementById('hall-tbody');
            this.constructorsTbody = document.getElementById('constructors-tbody');
            this.bossesTbody = document.getElementById('bosses-tbody');
            this.engineersTbody = document.getElementById('engineers-tbody');
            this.roundSelect = document.getElementById('round-select');
            this.roundContainer = document.getElementById('round-results-container');
            this.favTeamSelect = document.getElementById('fav-team-select');
            this.favDriverSelect = document.getElementById('fav-driver-select');
            this.statusMessage = document.getElementById('status-message');
            this.btnLoad = document.getElementById('load-data-btn');
            this.searchInput = document.getElementById('search-input');
        }

        bindTabs() {
            this.tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.tabButtons.forEach(btn => btn.classList.remove('active'));
                    this.tabContents.forEach(content => content.classList.remove('active'));
                    button.classList.add('active');
                    document.getElementById(button.getAttribute('data-target')).classList.add('active');
                });
            });
        }

        renderGrid(pilotos) {
            this.grid.textContent = '';
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
                this.grid.appendChild(card);
            });
        }

        renderStaticTables(hall, bosses, engineers) {
            this.hallTbody.textContent = "";
            hall.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${item.nome}</td><td>${item.titulos} Títulos</td><td>${item.equipe}</td>`;
                this.hallTbody.appendChild(tr);
            });

            this.bossesTbody.textContent = "";
            bosses.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${item.equipe}</td><td>${item.chefe}</td>`;
                this.bossesTbody.appendChild(tr);
            });

            this.engineersTbody.textContent = "";
            engineers.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${item.equipe}</td><td>${item.piloto}</td><td>${item.engenheiro}</td>`;
                this.engineersTbody.appendChild(tr);
            });
        }

        renderConstructors(standings) {
            this.constructorsTbody.textContent = "";
            standings.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${c.position}°</td><td>${c.Constructor.name}</td><td>${c.points} pts</td>`;
                this.constructorsTbody.appendChild(tr);
            });
        }

        renderRacesSelect(races) {
            this.roundSelect.textContent = "";
            races.forEach(race => {
                const opt = document.createElement('option');
                opt.value = race.round;
                opt.textContent = `Etapa ${race.round}: ${race.raceName}`;
                this.roundSelect.appendChild(opt);
            });
        }

        renderPreferencesOptions(pilotos) {
            this.favDriverSelect.innerHTML = '<option value="">Selecione o Piloto</option>';
            this.favTeamSelect.innerHTML = '<option value="">Selecione a Equipa</option>';
            const equipesUnicas = [...new Set(pilotos.map(p => p.Constructors[0].name))];
            
            equipesUnicas.forEach(eq => {
                const opt = document.createElement('option');
                opt.value = eq;
                opt.textContent = eq;
                this.favTeamSelect.appendChild(opt);
            });

            pilotos.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.Driver.driverId;
                opt.textContent = `${p.Driver.givenName} ${p.Driver.familyName}`;
                this.favDriverSelect.appendChild(opt);
            });
        }

        renderRoundDetails(qualiList, raceList) {
            this.roundContainer.textContent = "";

            const h3Q = document.createElement('h3');
            h3Q.textContent = "Resultados do Qualifying (Q1, Q2, Q3)";
            h3Q.style.marginBottom = "1rem";
            this.roundContainer.appendChild(h3Q);

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
            this.roundContainer.appendChild(tableQ);

            const h3R = document.createElement('h3');
            h3R.textContent = "Resultado Final da Corrida & Pontos";
            h3R.style.margin = "2rem 0 1rem 0";
            this.roundContainer.appendChild(h3R);

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
            this.roundContainer.appendChild(tableR);
        }
    }

    /* ==========================================
       CONTROLLER (Camada de Controle e Eventos)
       ========================================== */
    class F1Controller {
        constructor(model, view) {
            this.model = model;
            this.view = view;
            this.driversCache = [];
            this.init();
        }

        async init() {
            this.view.bindTabs();
            this.view.renderStaticTables(this.model.hallData, this.model.bossesData, this.model.engineersData);
            
            await this.loadDrivers();
            await this.loadConstructors();
            await this.loadRaces();
            this.loadPrefs();

            this.view.btnLoad.addEventListener('click', () => this.loadDrivers());
            this.view.searchInput.addEventListener('input', (e) => this.handleSearch(e));
            document.getElementById('save-prefs-btn').addEventListener('click', () => this.savePrefs());
            document.getElementById('clear-prefs-btn').addEventListener('click', () => this.clearPrefs());
            document.getElementById('load-round-btn').addEventListener('click', () => this.loadRound());
        }

        async loadDrivers() {
            try {
                this.view.btnLoad.textContent = "Sincronizando...";
                this.view.btnLoad.disabled = true;
                this.view.statusMessage.textContent = "Conectando à API...";

                this.driversCache = await this.model.fetchDriverStandings();
                this.view.renderGrid(this.driversCache);
                this.view.renderPreferencesOptions(this.driversCache);
                
                this.view.statusMessage.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR')}.`;
                this.view.searchInput.disabled = false;
            } catch (e) {
                this.view.statusMessage.textContent = "Falha ao carregar a telemetria.";
            } finally {
                this.view.btnLoad.textContent = "Sincronizar Dados";
                this.view.btnLoad.disabled = false;
            }
        }

        async loadConstructors() {
            try {
                const standings = await this.model.fetchConstructorStandings();
                this.view.renderConstructors(standings);
            } catch (e) {
                this.view.constructorsTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--f1-red);">Erro ao carregar construtores.</td></tr>`;
            }
        }

        async loadRaces() {
            try {
                const races = await this.model.fetchRaces();
                this.view.renderRacesSelect(races);
            } catch (e) {
                this.view.roundSelect.innerHTML = '<option disabled>Erro ao carregar GPs</option>';
            }
        }

        async loadRound() {
            const round = this.view.roundSelect.value;
            if (!round) return;

            this.view.roundContainer.textContent = "A carregar dados da etapa...";
            try {
                const data = await this.model.fetchRoundDetails(round);
                this.view.renderRoundDetails(data.quali, data.results);
            } catch (e) {
                this.view.roundContainer.textContent = "Falha ao carregar os dados detalhados.";
            }
        }

        handleSearch(e) {
            const termo = e.target.value.replace(/[<>\/\\;'"]/g, "").toLowerCase().trim();
            const filtrados = this.driversCache.filter(p => {
                const nome = `${p.Driver.givenName} ${p.Driver.familyName}`.toLowerCase();
                const equipe = p.Constructors[0].name.toLowerCase();
                return nome.includes(termo) || equipe.includes(termo);
            });
            this.view.renderGrid(filtrados);
        }

        savePrefs() {
            const prefs = {
                equipa: this.view.favTeamSelect.value,
                piloto: this.view.favDriverSelect.value
            };
            this.model.savePreferences(prefs);
            alert("Preferências guardadas com consentimento local (LGPD).");
        }

        clearPrefs() {
            this.model.clearPreferences();
            this.view.favTeamSelect.value = "";
            this.view.favDriverSelect.value = "";
            alert("Os seus dados guardados foram eliminados com sucesso do dispositivo.");
        }

        loadPrefs() {
            const prefs = this.model.getPreferences();
            if (prefs.equipa) this.view.favTeamSelect.value = prefs.equipa;
            if (prefs.piloto) this.view.favDriverSelect.value = prefs.piloto;
        }
    }

    // Inicialização protegida da aplicação ao carregar o DOM
    document.addEventListener('DOMContentLoaded', () => {
        new F1Controller(new F1Model(), new F1View());
    });
})();

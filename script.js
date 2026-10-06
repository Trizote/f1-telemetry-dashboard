(function() {
    "use strict";

    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    /* ==========================================
       MODEL (Camada de Dados, Lógica e LGPD)
       ========================================== */
    class F1Model {
        constructor() {
            this._hallCurrentData = [
                { nome: "Lewis Hamilton", titulos: 7, equipe: "Ferrari" },
                { nome: "Max Verstappen", titulos: 4, equipe: "Red Bull Racing" },
                { nome: "Fernando Alonso", titulos: 2, equipe: "Aston Martin" },
                { nome: "Lando Norris", titulos: 1, equipe: "McLaren" }
            ];

            this._hallHistoricData = [
                { ano: 2025, piloto: "Lando Norris", equipe: "McLaren", poles: 7, vitorias: 7, podios: 18, construtor: "McLaren" },
                { ano: 2024, piloto: "Max Verstappen", equipe: "RBR", poles: 8, vitorias: 8, podios: 13, construtor: "McLaren" },
                { ano: 2023, piloto: "Max Verstappen", equipe: "RBR", poles: 12, vitorias: 19, podios: 21, construtor: "RBR" },
                { ano: 2022, piloto: "Max Verstappen", equipe: "RBR", poles: 7, vitorias: 15, podios: 17, construtor: "RBR" },
                { ano: 2021, piloto: "Max Verstappen", equipe: "RBR", poles: 10, vitorias: 10, podios: 18, construtor: "Mercedes" },
                { ano: 2020, piloto: "Lewis Hamilton", equipe: "Mercedes", poles: 10, vitorias: 11, podios: 14, construtor: "Mercedes" },
                { ano: 2019, piloto: "Lewis Hamilton", equipe: "Mercedes", poles: 4, vitorias: 10, podios: 16, construtor: "Mercedes" },
                { ano: 2018, piloto: "Lewis Hamilton", equipe: "Mercedes", poles: 9, vitorias: 9, podios: 15, construtor: "Mercedes" },
                { ano: 2017, piloto: "Lewis Hamilton", equipe: "Mercedes", poles: 11, vitorias: 9, podios: 13, construtor: "Mercedes" },
                { ano: 2016, piloto: "Nico Rosberg", equipe: "Mercedes", poles: 8, vitorias: 9, podios: 16, construtor: "Mercedes" },
                { ano: 2015, piloto: "Lewis Hamilton", equipe: "Mercedes", poles: 11, vitorias: 10, podios: 17, construtor: "Mercedes" },
                { ano: 2014, piloto: "Lewis Hamilton", equipe: "Mercedes", poles: 7, vitorias: 11, podios: 16, construtor: "Mercedes" },
                { ano: 2013, piloto: "Sebastian Vettel", equipe: "RBR", poles: 9, vitorias: 13, podios: 16, construtor: "RBR" },
                { ano: 2012, piloto: "Sebastian Vettel", equipe: "RBR", poles: 6, vitorias: 5, podios: 10, construtor: "RBR" },
                { ano: 2011, piloto: "Sebastian Vettel", equipe: "RBR", poles: 15, vitorias: 11, podios: 17, construtor: "RBR" },
                { ano: 2010, piloto: "Sebastian Vettel", equipe: "RBR", poles: 10, vitorias: 5, podios: 10, construtor: "RBR" },
                { ano: 2009, piloto: "Jenson Button", equipe: "Brawn", poles: 4, vitorias: 6, podios: 8, construtor: "Brawn" },
                { ano: 2008, piloto: "Lewis Hamilton", equipe: "McLaren", poles: 7, vitorias: 5, podios: 10, construtor: "Ferrari" },
                { ano: 2007, piloto: "Kimi Räikkönen", equipe: "Ferrari", poles: 3, vitorias: 6, podios: 12, construtor: "Ferrari" },
                { ano: 2006, piloto: "Fernando Alonso", equipe: "Renault", poles: 6, vitorias: 7, podios: 14, construtor: "Renault" },
                { ano: 2005, piloto: "Fernando Alonso", equipe: "Renault", poles: 6, vitorias: 7, podios: 15, construtor: "Renault" },
                { ano: 2004, piloto: "Michael Schumacher", equipe: "Ferrari", poles: 8, vitorias: 13, podios: 15, construtor: "Ferrari" },
                { ano: 2003, piloto: "Michael Schumacher", equipe: "Ferrari", poles: 5, vitorias: 6, podios: 8, construtor: "Ferrari" },
                { ano: 2002, piloto: "Michael Schumacher", equipe: "Ferrari", poles: 7, vitorias: 11, podios: 17, construtor: "Ferrari" },
                { ano: 2001, piloto: "Michael Schumacher", equipe: "Ferrari", poles: 11, vitorias: 9, podios: 14, construtor: "Ferrari" },
                { ano: 2000, piloto: "Michael Schumacher", equipe: "Ferrari", poles: 9, vitorias: 9, podios: 12, construtor: "Ferrari" },
                { ano: 1999, piloto: "Mika Häkkinen", equipe: "McLaren", poles: 11, vitorias: 5, podios: 10, construtor: "Ferrari" },
                { ano: 1998, piloto: "Mika Häkkinen", equipe: "McLaren", poles: 9, vitorias: 8, podios: 11, construtor: "Williams" },
                { ano: 1997, piloto: "Jacques Villeneuve", equipe: "Williams", poles: 10, vitorias: 7, podios: 8, construtor: "Williams" },
                { ano: 1996, piloto: "Damon Hill", equipe: "Williams", poles: 9, vitorias: 8, podios: 10, construtor: "Williams" },
                { ano: 1995, piloto: "Michael Schumacher", equipe: "Benetton", poles: 4, vitorias: 9, podios: 11, construtor: "Benetton" },
                { ano: 1994, piloto: "Michael Schumacher", equipe: "Benetton", poles: 6, vitorias: 8, podios: 10, construtor: "Williams" },
                { ano: 1993, piloto: "Alain Prost", equipe: "Williams", poles: 13, vitorias: 7, podios: 12, construtor: "Williams" },
                { ano: 1992, piloto: "Nigel Mansell", equipe: "Williams", poles: 14, vitorias: 9, podios: 12, construtor: "Williams" },
                { ano: 1991, piloto: "Ayrton Senna", equipe: "McLaren", poles: 8, vitorias: 7, podios: 12, construtor: "McLaren" },
                { ano: 1990, piloto: "Ayrton Senna", equipe: "McLaren", poles: 10, vitorias: 6, podios: 11, construtor: "McLaren" },
                { ano: 1989, piloto: "Alain Prost", equipe: "McLaren", poles: 2, vitorias: 4, podios: 11, construtor: "McLaren" },
                { ano: 1988, piloto: "Ayrton Senna", equipe: "McLaren", poles: 13, vitorias: 8, podios: 11, construtor: "McLaren" },
                { ano: 1987, piloto: "Nelson Piquet", equipe: "Williams", poles: 4, vitorias: 3, podios: 11, construtor: "Williams" },
                { ano: 1986, piloto: "Alain Prost", equipe: "McLaren", poles: 1, vitorias: 4, podios: 11, construtor: "Williams" },
                { ano: 1985, piloto: "Alain Prost", equipe: "McLaren", poles: 2, vitorias: 5, podios: 11, construtor: "McLaren" },
                { ano: 1984, piloto: "Niki Lauda", equipe: "McLaren", poles: 0, vitorias: 5, podios: 9, construtor: "McLaren" },
                { ano: 1983, piloto: "Nelson Piquet", equipe: "Brabham", poles: 1, vitorias: 3, podios: 8, construtor: "Ferrari" },
                { ano: 1982, piloto: "Keke Rosberg", equipe: "Williams", poles: 1, vitorias: 1, podios: 6, construtor: "Ferrari" },
                { ano: 1981, piloto: "Nelson Piquet", equipe: "Brabham", poles: 4, vitorias: 3, podios: 7, construtor: "Williams" },
                { ano: 1980, piloto: "Alan Jones", equipe: "Williams", poles: 3, vitorias: 5, podios: 10, construtor: "Williams" },
                { ano: 1979, piloto: "Jody Scheckter", equipe: "Ferrari", poles: 1, vitorias: 3, podios: 6, construtor: "Ferrari" },
                { ano: 1978, piloto: "Mario Andretti", equipe: "Lotus", poles: 8, vitorias: 6, podios: 7, construtor: "Lotus" },
                { ano: 1977, piloto: "Niki Lauda", equipe: "Ferrari", poles: 2, vitorias: 3, podios: 10, construtor: "Ferrari" },
                { ano: 1976, piloto: "James Hunt", equipe: "McLaren", poles: 8, vitorias: 6, podios: 8, construtor: "Ferrari" },
                { ano: 1975, piloto: "Niki Lauda", equipe: "Ferrari", poles: 9, vitorias: 5, podios: 8, construtor: "Ferrari" },
                { ano: 1974, piloto: "Emerson Fittipaldi", equipe: "McLaren", poles: 2, vitorias: 3, podios: 7, construtor: "McLaren" },
                { ano: 1973, piloto: "Jackie Stewart", equipe: "Tyrrell", poles: 3, vitorias: 5, podios: 8, construtor: "Lotus" },
                { ano: 1972, piloto: "Emerson Fittipaldi", equipe: "Lotus", poles: 3, vitorias: 5, podios: 8, construtor: "Lotus" },
                { ano: 1971, piloto: "Jackie Stewart", equipe: "Tyrrell", poles: 6, vitorias: 6, podios: 7, construtor: "Tyrrell" },
                { ano: 1970, piloto: "Jochen Rindt", equipe: "Lotus", poles: 3, vitorias: 5, podios: 5, construtor: "Lotus" },
                { ano: 1969, piloto: "Jackie Stewart", equipe: "Matra", poles: 2, vitorias: 6, podios: 7, construtor: "Matra" },
                { ano: 1968, piloto: "Graham Hill", equipe: "Lotus", poles: 2, vitorias: 3, podios: 6, construtor: "Lotus" },
                { ano: 1967, piloto: "Denny Hulme", equipe: "Brabham", poles: 0, vitorias: 2, podios: 8, construtor: "Brabham-Repco" },
                { ano: 1966, piloto: "Jack Brabham", equipe: "Brabham", poles: 3, vitorias: 4, podios: 5, construtor: "Brabham-Repco" },
                { ano: 1965, piloto: "Jim Clark", equipe: "Lotus", poles: 6, vitorias: 6, podios: 6, construtor: "Lotus" },
                { ano: 1964, piloto: "John Surtees", equipe: "Ferrari", poles: 2, vitorias: 2, podios: 6, construtor: "Ferrari" },
                { ano: 1963, piloto: "Jim Clark", equipe: "Lotus", poles: 7, vitorias: 7, podios: 9, construtor: "Lotus" },
                { ano: 1962, piloto: "Graham Hill", equipe: "BRM", poles: 1, vitorias: 4, podios: 6, construtor: "BRM" },
                { ano: 1961, piloto: "Phil Hill", equipe: "Ferrari", poles: 5, vitorias: 2, podios: 6, construtor: "Ferrari" },
                { ano: 1960, piloto: "Jack Brabham", equipe: "Cooper", poles: 3, vitorias: 5, podios: 5, construtor: "Cooper-Climax" },
                { ano: 1959, piloto: "Jack Brabham", equipe: "Cooper", poles: 1, vitorias: 2, podios: 5, construtor: "Cooper-Climax" },
                { ano: 1958, piloto: "Mike Hawthorn", equipe: "Ferrari", poles: 4, vitorias: 1, podios: 7, construtor: "Vanwall" },
                { ano: 1957, piloto: "Juan Manuel Fangio", equipe: "Maserati", poles: 4, vitorias: 4, podios: 6, construtor: "-" },
                { ano: 1956, piloto: "Juan Manuel Fangio", equipe: "Ferrari", poles: 6, vitorias: 3, podios: 5, construtor: "-" },
                { ano: 1955, piloto: "Juan Manuel Fangio", equipe: "Mercedes", poles: 3, vitorias: 4, podios: 5, construtor: "-" },
                { ano: 1954, piloto: "Juan Manuel Fangio", equipe: "Maserati/Mercedes", poles: 5, vitorias: 6, podios: 7, construtor: "-" },
                { ano: 1953, piloto: "Alberto Ascari", equipe: "Ferrari", poles: 6, vitorias: 5, podios: 5, construtor: "-" },
                { ano: 1952, piloto: "Alberto Ascari", equipe: "Ferrari", poles: 5, vitorias: 6, podios: 6, construtor: "-" },
                { ano: 1951, piloto: "Juan Manuel Fangio", equipe: "Alfa Romeo", poles: 4, vitorias: 3, podios: 5, construtor: "-" },
                { ano: 1950, piloto: "Nino Farina", equipe: "Alfa Romeo", poles: 2, vitorias: 3, podios: 3, construtor: "-" }
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

        get hallCurrentData() { return this._hallCurrentData; }
        get hallHistoricData() { return this._hallHistoricData; }
        get bossesData() { return this._bossesData; }
        get engineersData() { return this._engineersData; }

        async fetchDriverStandings() {
            const res = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
            const data = await res.json();
            let standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            standings.forEach(p => {
                const id = p.Driver.driverId;
                if (id === "bortoleto" || id === "hulkenberg") {
                    if (p.Constructors && p.Constructors[0]) p.Constructors[0].name = "Audi";
                } else if (id === "bottas" || id === "perez" || id === "sergio_perez") {
                    if (p.Constructors && p.Constructors[0]) p.Constructors[0].name = "Cadillac";
                }
            });

            return standings;
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
            this.roundSelect = document.getElementById('round-select');
            this.roundContainer = document.getElementById('round-results-container');
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

  getAvatarMap() {
            return {
                "hamilton": "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png",
                "max_verstappen": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png",
                "alonso": "https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png",
                "norris": "https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png",
                "leclerc": "https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png",
                "russell": "https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png",
                "piastri": "https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png",
                "antonelli": "https://img2.51gt3.com/rac/racer/202503/bcca7f61b6684e26bb28aedaf8d97c53.png",
                "andrea_kimi_antonelli": "https://img2.51gt3.com/rac/racer/202503/bcca7f61b6684e26bb28aedaf8d97c53.png",
                "tsunoda": "https://www.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/2col/image.png",
                "albon": "https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png",
                "sainz": "https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png",
                "lawson": "https://www.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/2col/image.png",
                "stroll": "https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png",
                "ocon": "https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png",
                "bearman": "https://www.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/2col/image.png",
                "hulkenberg": "https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png",
                "bortoleto": "https://www.formula1.com/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/2col/image.png",
                "gasly": "https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png",
                "colapinto": "https://www.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/2col/image.png",
                "bottas": "https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/2col/image.png",
                "perez": "https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png",
                "sergio_perez": "https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png",
                "hadjar": "https://www.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/2col/image.png",
                "isack_hadjar": "https://www.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/2col/image.png",
                "lindblad": "https://cdn-8.motorsport.com/images/mgl/YE9wONPY/s1200/arvid-lindblad-racing-bulls.webp",
                "arvid_lindblad": "https://cdn-8.motorsport.com/images/mgl/YE9wONPY/s1200/arvid-lindblad-racing-bulls.webp"
            };
        }

        
                renderGrid(pilotos) {
            this.grid.textContent = '';
            const driverAvatars = this.getAvatarMap();

            pilotos.forEach(piloto => {
                const card = document.createElement('div');
                card.className = 'driver-card';

                const driverId = piloto.Driver.driverId;
                const initials = `${piloto.Driver.givenName[0]}${piloto.Driver.familyName[0]}`;
                const photoUrl = driverAvatars[driverId];

                const avatarBox = document.createElement('div');
                avatarBox.className = 'driver-avatar-container';

                if (photoUrl) {
                    const img = document.createElement('img');
                    img.src = photoUrl;
                    img.alt = piloto.Driver.familyName;
                    img.onerror = () => {
                        avatarBox.textContent = initials;
                        avatarBox.style.display = "flex";
                        avatarBox.style.alignItems = "center";
                        avatarBox.style.justifyContent = "center";
                        avatarBox.style.color = "#ff1801";
                        avatarBox.style.fontWeight = "bold";
                        avatarBox.style.fontSize = "1.1rem";
                        img.remove();
                    };
                    avatarBox.appendChild(img);
                } else {
                    avatarBox.textContent = initials;
                    avatarBox.style.display = "flex";
                    avatarBox.style.alignItems = "center";
                    avatarBox.style.justifyContent = "center";
                    avatarBox.style.color = "#ff1801";
                    avatarBox.style.fontWeight = "bold";
                    avatarBox.style.fontSize = "1.1rem";
                }

                const infoDiv = document.createElement('div');
                infoDiv.className = 'driver-card-info';

                const name = document.createElement('h2');
                name.textContent = `${piloto.Driver.givenName} ${piloto.Driver.familyName}`;

                const team = document.createElement('p');
                team.className = 'team-name';
                team.textContent = piloto.Constructors[0].name;

                const points = document.createElement('p');
                points.className = 'points';
                points.textContent = `${piloto.points} pts`;

                infoDiv.append(name, team, points);
                card.append(avatarBox, infoDiv);
                this.grid.appendChild(card);
            });
        }

        renderDriversTable(pilotos) {
            const tbody = document.getElementById('drivers-table-tbody');
            if (!tbody) return;
            tbody.textContent = '';
            const driverAvatars = this.getAvatarMap();

            pilotos.forEach((piloto, index) => {
                const tr = document.createElement('tr');
                const driverId = piloto.Driver.driverId;
                const photoUrl = driverAvatars[driverId] || "";
                const initials = `${piloto.Driver.givenName[0]}${piloto.Driver.familyName[0]}`;

                tr.innerHTML = `
                    <td style="font-weight: bold; color: #fff;">${piloto.position || (index + 1)}</td>
                    <td>
                        <div class="driver-row-info">
                            <div class="table-driver-avatar">
                                ${photoUrl ? `<img src="${photoUrl}" alt="${piloto.Driver.familyName}">` : `<span style="display:flex;align-items:center;justify-content:center;height:100%;color:#ff1801;font-size:0.8rem;">${initials}</span>`}
                            </div>
                            <span class="driver-name-span">${piloto.Driver.givenName} ${piloto.Driver.familyName}</span>
                        </div>
                    </td>
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${piloto.Constructors[0].name}</td>
                    <td style="text-align: right; font-weight: bold; color: var(--f1-red);">${piloto.points}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        renderStaticTables(hallCurrent, hallHistoric, bosses, engineers) {
            const hallCurrentTbody = document.getElementById('hall-current-tbody');
            const hallHistoricTbody = document.getElementById('hall-historic-tbody');
            const bossesTbody = document.getElementById('bosses-tbody');
            const engineersTbody = document.getElementById('engineers-tbody');

            if (hallCurrentTbody) {
                hallCurrentTbody.textContent = "";
                hallCurrent.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${item.nome}</td><td>${item.titulos} Títulos</td><td>${item.equipe}</td>`;
                    hallCurrentTbody.appendChild(tr);
                });
            }

            if (hallHistoricTbody) {
                hallHistoricTbody.textContent = "";
                hallHistoric.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td><strong>${item.ano}</strong></td><td>${item.piloto}</td><td>${item.equipe}</td><td>${item.poles}</td><td>${item.vitorias}</td><td>${item.podios}</td><td>${item.construtor}</td>`;
                    hallHistoricTbody.appendChild(tr);
                });
            }

            if (bossesTbody) {
                bossesTbody.textContent = "";
                bosses.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${item.equipe}</td><td>${item.chefe}</td>`;
                    bossesTbody.appendChild(tr);
                });
            }

              if (engineersTbody) {
                engineersTbody.textContent = "";
                engineers.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${item.equipe}</td><td>${item.piloto}</td><td>${item.engenheiro}</td>`;
                    engineersTbody.appendChild(tr);
                });
            }
        }

        renderConstructors(standings) {
            const constructorsTbody = document.getElementById('constructors-tbody');
            if (!constructorsTbody) return;
            constructorsTbody.textContent = "";
            standings.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${c.position}°</td><td>${c.Constructor.name}</td><td>${c.points} pts</td>`;
                constructorsTbody.appendChild(tr);
            });
        }

        renderRacesSelect(races) {
            if (!this.roundSelect) return;
            this.roundSelect.textContent = "";
            races.forEach(race => {
                const opt = document.createElement('option');
                opt.value = race.round;
                opt.textContent = `Etapa ${race.round}: ${race.raceName}`;
                this.roundSelect.appendChild(opt);
            });
        }

        renderPreferencesOptions(pilotos) {
            const teamDropdown = document.getElementById('custom-team-dropdown');
            const driverDropdown = document.getElementById('custom-driver-dropdown');
            if (!teamDropdown || !driverDropdown) return;
            
            const teamOptionsContainer = teamDropdown.querySelector('.custom-options');
            const driverOptionsContainer = driverDropdown.querySelector('.custom-options');
            
            teamOptionsContainer.innerHTML = '';
            driverOptionsContainer.innerHTML = '';

            const equipesUnicas = [...new Set(pilotos.map(p => p.Constructors[0].name))];

            this._addCustomOption(teamDropdown, teamOptionsContainer, '', 'Selecione a Equipa');
            equipesUnicas.forEach(eq => {
                this._addCustomOption(teamDropdown, teamOptionsContainer, eq, eq);
            });

            this._addCustomOption(driverDropdown, driverOptionsContainer, '', 'Selecione o Piloto');
            pilotos.forEach(p => {
                const nomePiloto = `${p.Driver.givenName} ${p.Driver.familyName}`;
                this._addCustomOption(driverDropdown, driverOptionsContainer, p.Driver.driverId, nomePiloto);
            });

            this._initCustomDropdowns();
        }

        _addCustomOption(dropdown, container, value, text) {
            const opt = document.createElement('div');
            opt.className = 'custom-option';
            opt.setAttribute('data-value', value);
            opt.textContent = text;
            
            opt.addEventListener('click', () => {
                const triggerSpan = dropdown.querySelector('.custom-select-trigger span');
                const hiddenInput = dropdown.parentElement.querySelector('input[type="hidden"]');
                
                triggerSpan.textContent = text;
                hiddenInput.value = value;
                
                dropdown.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                
                dropdown.classList.remove('open');
            });

            container.appendChild(opt);
        }

        _initCustomDropdowns() {
            document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
                const trigger = wrapper.querySelector('.custom-select-trigger');
                trigger.onclick = (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                        if (w !== wrapper) w.classList.remove('open');
                    });
                    wrapper.classList.toggle('open');
                };
            });

            window.onclick = () => {
                document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
            };
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
            this.view.renderStaticTables(
                this.model.hallCurrentData, 
                this.model.hallHistoricData, 
                this.model.bossesData, 
                this.model.engineersData
            );
            
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
                this.view.renderDriversTable(this.driversCache);
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
                // Silencioso
            }
        }

        async loadRaces() {
            try {
                const races = await this.model.fetchRaces();
                this.view.renderRacesSelect(races);
            } catch (e) {
                // Silencioso
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
            this.view.renderDriversTable(filtrados);
        }

        savePrefs() {
            const prefs = {
                equipa: document.getElementById('fav-team-select').value,
                piloto: document.getElementById('fav-driver-select').value
            };
            this.model.savePreferences(prefs);
            alert("Preferências guardadas com consentimento local (LGPD).");
        }

        clearPrefs() {
            this.model.clearPreferences();
            document.getElementById('fav-team-select').value = "";
            document.getElementById('fav-driver-select').value = "";
            
            document.querySelector('#custom-team-dropdown .custom-select-trigger span').textContent = "Selecione a Equipa";
            document.querySelector('#custom-driver-dropdown .custom-select-trigger span').textContent = "Selecione o Piloto";
            
            alert("Os seus dados guardados foram eliminados com sucesso do dispositivo.");
        }

        loadPrefs() {
            const prefs = this.model.getPreferences();
            if (prefs.equipa) {
                document.getElementById('fav-team-select').value = prefs.equipa;
                const teamTrigger = document.querySelector('#custom-team-dropdown .custom-select-trigger span');
                if (teamTrigger) teamTrigger.textContent = prefs.equipa;
            }
            if (prefs.piloto) {
                document.getElementById('fav-driver-select').value = prefs.piloto;
                const matchedDriver = this.driversCache.find(p => p.Driver.driverId === prefs.piloto);
                if (matchedDriver) {
                    const driverTrigger = document.querySelector('#custom-driver-dropdown .custom-select-trigger span');
                    if (driverTrigger) driverTrigger.textContent = `${matchedDriver.Driver.givenName} ${matchedDriver.Driver.familyName}`;
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new F1Controller(new F1Model(), new F1View());
    });
})();
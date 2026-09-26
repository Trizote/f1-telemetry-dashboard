// DEFESA 4: Anti-Clickjacking
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

const btnLoad = document.getElementById('load-data-btn');
const searchInput = document.getElementById('search-input');
const grid = document.getElementById('dashboard-grid');
const statusMessage = document.getElementById('status-message');

// Cache local para a pesquisa funcionar sem gastar internet do usuário
let listaPilotosCache = [];

// Função principal de requisição
async function sincronizarDados() {
    try {
        btnLoad.textContent = "Sincronizando...";
        btnLoad.disabled = true;
        searchInput.disabled = true;
        statusMessage.textContent = "Estabelecendo conexão segura com a API...";

        // DEFESA 5: Conexão Segura TLS/HTTPS
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        
        if (!response.ok) {
            throw new Error("Falha na comunicação com o servidor.");
        }

        const data = await response.json();
        listaPilotosCache = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        // Renderiza todos os pilotos ao carregar
        renderizarGrid(listaPilotosCache);
        
        // Atualiza a interface
        const dataHora = new Date().toLocaleTimeString('pt-BR');
        statusMessage.textContent = `Última sincronização com sucesso às ${dataHora}.`;
        searchInput.disabled = false; // Libera a barra de pesquisa

    } catch (error) {
        // DEFESA 7: Fail Secure
        console.error("Erro interno protegido:", error.message);
        statusMessage.textContent = "Alerta: Falha na telemetria. Não foi possível carregar os dados.";
        grid.textContent = "";
    } finally {
        // DEFESA 8: Rate Limiting (Cooldown de 3 segundos)
        btnLoad.textContent = "Aguarde...";
        setTimeout(() => {
            btnLoad.textContent = "Sincronizar Dados";
            btnLoad.disabled = false;
        }, 3000); 
    }
}

// Função para desenhar os cards (Isolada para ser usada pela pesquisa)
function renderizarGrid(pilotos) {
    grid.textContent = ''; // Limpa o grid de forma segura

    if (pilotos.length === 0) {
        grid.textContent = "Nenhum piloto ou equipe corresponde à pesquisa.";
        return;
    }

    pilotos.forEach(piloto => {
        // DEFESA 6: Proteção contra XSS
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

        card.appendChild(position);
        card.appendChild(name);
        card.appendChild(team);
        card.appendChild(points);
        
        grid.appendChild(card);
    });
}

// Lógica de pesquisa em tempo real (Filtro Anti-XSS)
searchInput.addEventListener('input', (evento) => {
    // Sanitiza e padroniza o texto digitado
    const termo = evento.target.value.toLowerCase().trim();

    // Filtra a lista da memória
    const resultadosFiltrados = listaPilotosCache.filter(piloto => {
        const nomeCompleto = `${piloto.Driver.givenName} ${piloto.Driver.familyName}`.toLowerCase();
        const nomeEquipe = piloto.Constructors[0].name.toLowerCase();
        
        // Retorna verdadeiro se o termo digitado estiver no nome do piloto ou da equipe
        return nomeCompleto.includes(termo) || nomeEquipe.includes(termo);
    });

    // Redesenha a tela apenas com os resultados filtrados
    renderizarGrid(resultadosFiltrados);
});

// Inicialização dos eventos
btnLoad.addEventListener('click', sincronizarDados);

const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

/*

Implementações no Código para o Desafio

*/

const modalBackground = document.getElementById('modalBackground');

function openPokemonModal(pokemon) {
    const modal = document.getElementById('pokemonModal');

    const adjustStatName = (name) => {
        if (name === "special-defense") return "S-Defense";
        if (name === "special-attack") return "S-Attack";
        return name;
    };

    const abilitiesContent = pokemon.abilities.map(ability => 
        `<p>${ability.name} ${ability.isHidden ? '' : ''}</p>`).join('');
        
        const statsContent = pokemon.stats.map(stat => {
            const color = getStatColor(stat.name);
            const adjustedName = adjustStatName(stat.name);
            return `
                <div class="stat">
                    <label>${adjustedName}</label>
                    <div class="stat-bar" data-value="${stat.baseStat}">
                        <div class="stat-fill" style="background-color: ${color};"></div>
                    </div>
                </div>
            `;
        }).join('');
    
        modal.innerHTML = `
        <img src="/js-developer-pokedex/assets/img/cancel.png" class="close" onclick="closePokemonModal()">
        
        <div class="top-third">
            <div class="left-side">
                <h2>${pokemon.name}</h2>
                ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join(' ')}
            </div>
            <div class="right-side">
                <span class="number">#${pokemon.number}</span>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </div>
    
        <div class="pokemon-modal-nav">
            <button onclick="showTab('status')">Status</button>
            <button onclick="showTab('habilidades')">Habilidades</button>
            
        </div>
    
        <div class="pokemon-modal-content habilidades">
            ${abilitiesContent}
        </div>
    
        <div class="pokemon-modal-content status">
            ${statsContent}
        </div>
    
    `;

    modal.style.display = 'block';
    modalBackground.style.display = 'block';
    showTab('status');

    

}
function getStatColor(statName) {
    switch (statName) {
        case 'hp': return 'red';
        case 'attack': return 'orange';
        case 'defense': return 'blue';
        case 'special-attack': return 'purple';
        case 'special-defense': return 'pink';
        case 'speed': return 'green';
        default: return 'grey';
    }
} 

function closePokemonModal() {
    const modal = document.getElementById('pokemonModal');
    modal.style.display = 'none';
    modalBackground.style.display = 'none';
}

modalBackground.addEventListener('click', closePokemonModal);

pokemonList.addEventListener('click', (event) => {
    const li = event.target.closest('.pokemon');
    if (li) {
        const pokemonName = li.querySelector('.name').textContent;
        pokeApi.getPokemonDetailByName(pokemonName).then(openPokemonModal);
    }
});

function showTab(tabName) {
    const contents = document.querySelectorAll('.pokemon-modal-content');
    const navButtons = document.querySelectorAll('.pokemon-modal-nav button');

    contents.forEach(content => content.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));

    document.querySelector(`.pokemon-modal-content.${tabName}`).classList.add('active');
    document.querySelector(`.pokemon-modal-nav button[onclick="showTab('${tabName}')"]`).classList.add('active');

    if (tabName === 'status') {
        animateStatusBars();
    }
}

function animateStatusBars() {
    setTimeout(() => {
        document.querySelectorAll('.stat-bar').forEach(bar => {
            const value = bar.getAttribute('data-value');
            const fillBar = bar.querySelector('.stat-fill');
            fillBar.style.width = `${value / 110 * 100}%`;
        });
    }, 50);  
}

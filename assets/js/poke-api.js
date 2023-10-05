
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.abilities = pokeDetail.abilities.map(ability => ({
        name: ability.ability.name,
        url: ability.ability.url,
        isHidden: ability.is_hidden,
        slot: ability.slot
    }));

    pokemon.stats = pokeDetail.stats.map(stat => ({
        baseStat: stat.base_stat,
        name: stat.stat.name,
        url: stat.stat.url
    }));
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
pokeApi.getPokemonDetailByName = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
}

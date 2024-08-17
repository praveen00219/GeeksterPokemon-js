let pokemonContainer = document.querySelector("#pokemon_card_container");
let searchInput = document.getElementById("search");
let filterBtn = document.getElementById("filter");
let type = document.getElementById("type");

// Fetch Pokémon data
async function fetchPokemOnData(i) {
  let data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
  let result = await data.json();
  return result;
}

// Fetch Pokémon types for the dropdown
async function fetchPokemOnTypes() {
  let data = await fetch(`https://pokeapi.co/api/v2/type/`);
  let result = await data.json();
  return result;
}

// Create Pokémon card
function createCard(pokemon) {
  let card = document.createElement("div");
  card.classList.add("card-container");
  card.innerHTML = `
        <div class="card p-2">
            <div class="front flex flex-col items-center justify-center gap-4">
                <img src='${pokemon.sprites.front_default}' class="w-full h-36 object-cover rounded-lg"/>
                <p class="name text-xl font-bold capitalize">${pokemon.name}</p>
                <p class="types text-sm text-gray-700">${pokemon.types[0].type.name}</p>
                <div class="ability flex space-x-2 text-sm">
                    <div class="ability-box p-1 border rounded">Hp: ${pokemon.stats[0].base_stat}</div>
                    <div class="ability-box p-1 border rounded">Att: ${pokemon.stats[1].base_stat}</div>  
                    <div class="ability-box p-1 border rounded">Def: ${pokemon.stats[2].base_stat}</div>
                </div>
            </div>
            <div class="back absolute inset-0 rounded-lg flex flex-col items-center justify-center ">
                <img src='${pokemon.sprites.back_default}' class="w-full h-36 object-cover rounded-lg"/>
                <div class="name text-xl font-bold capitalize">${pokemon.name}</div>
                <div class="types text-sm text-gray-600">${pokemon.types[0].type.name}</div>
            </div>
        </div>
    `;
  return card;
}

// Populate Pokémon types dropdown
async function populateTypeDropdown() {
  let typesData = await fetchPokemOnTypes();
  typesData.results.forEach((typeItem) => {
    let option = document.createElement("option");
    option.value = typeItem.name;
    option.textContent =
      typeItem.name.charAt(0).toUpperCase() + typeItem.name.slice(1);
    type.appendChild(option);
  });
}

// Apply filters
function applyFilters() {
  let notFound = document.getElementById("notFound");
  let allCards = document.querySelectorAll(".card-container");
  let selectedType = type.value.toLowerCase();
  allCards.forEach((card) => {
    let cardType = card.querySelector(".types").textContent.toLowerCase();
    if (selectedType === "" || cardType === selectedType) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
      notFound.style.display = "flex";
    }
  });
}

// Handle search functionality
function handleSearch() {
  let notFound = document.getElementById("notFound");
  let searchValue = searchInput.value.toUpperCase();
  let allCards = document.querySelectorAll(".card-container");
  allCards.forEach(function (card) {
    let cardName = card.querySelector(".name").textContent.toUpperCase();
    if (cardName.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
      notFound.style.display = "flex";
    }
  });
}

// Event listeners
filterBtn.addEventListener("click", applyFilters);
searchInput.addEventListener("keyup", handleSearch);

// Fetch and display Pokémon data
async function fetchNPokemons() {
  for (let i = 1; i <= 204; i++) {
    let pokemon = await fetchPokemOnData(i);
    let cardElement = createCard(pokemon);
    pokemonContainer.appendChild(cardElement);
  }
}

// Initial data fetch
async function initialize() {
  await fetchNPokemons();
  await populateTypeDropdown();
}

initialize();

// --------------------------------------------------------

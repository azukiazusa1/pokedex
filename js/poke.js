const url = 'https://pokeapi.co/api/v2/pokemon';
const AREA = {
  kanto: '?offset=0&limit=151',
  johto: '?offset=151&limit=100'
};
const LANGUAGE = {
  JP: 'ja'
};

Vue.component('pokemon-index',{
  props: ['pokemon'],
  data: function() {
    return {
      species : null
    }
  },
  mounted () {
    (async () => {
      try {
        let species = await axios.get(this.pokemon.species.url);
        return this.species = species.data;
      } catch(err){
        console.error("error!");
      }
    })();
  },
  computed: {
    getType: function () {
      let types = this.pokemon.types;
      if (types.length === 2) {
        return `【${types[0].type.name}】【${types[1].type.name}】`;
      } else {
        return `【${types[0].type.name}】`;
      }
    },
    getI18nName: function() {
      if (this.species !== null) {
        let names = this.species.names;
        let result = names.find(v => v.language.name === LANGUAGE.JP);
        return result.name;
      }
    },
    getI18nFlavorText: function() {
      if (this.species !== null) {
        let flavor_text_entries = this.species.flavor_text_entries;
        let result = flavor_text_entries.find(v => v.language.name === LANGUAGE.JP);
        return result.flavor_text;
      }
    },
    getI18nGenera: function() {
      if (this.species !== null) {
        let genera = this.species.genera;
        let result = genera.find(v => v.language.name === LANGUAGE.JP);
        return result.genus;
      }
    }
  },
  template: `
  <li class="pokemon-index">
    <h3>{{ pokemon.id }}. {{ getI18nName }}</h3>
    <img v-bind:src="pokemon.sprites.front_default"/>
    <div>{{ getType }}</div>
    <div>{{ getI18nGenera }}</div>
    <div>{{ getI18nFlavorText }} </div>
    <div>たかさ:{{ pokemon.height / 10 }}m</div>
    <div>おもさ:{{ pokemon.weight / 10 }}Kg</div>
  </li>`
})

new Vue({
  el: '#main',
  data: {
    pokemons: [],
    area: 'kanto',
  },
  methods: {
    search: async function() {
      try {
        this.pokemons = [];
        let urls = [];
        let responses = await axios.get(url + AREA[this.area]);
        let items = responses.data.results;
        for (let item of items) {
          urls.push(item.url);
        }
        this.pokemons = await Promise.all(urls.map(axios.get));
      } catch(err){
        console.error("error!");
      }
    }
  },
  mounted () {
    this.search();
  },
  watch: {
    area: function () {
      this.search();
    }
  }
})
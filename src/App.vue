<template>
  <div id="app">
    地方：
    <select v-model="area">
      <option value="kanto">カントー</option>
      <option value="johto">ジョウト</option>
      <option value="hohen">ホウエン</option>
      <option value="sinnoh">シンオウ</option>
      <option value="karos">カロス</option>
      <option value="alola">アローラ</option>
    </select>
    Language:
    <select v-model="local">
      <option value="JP">日本</option>
      <option value="EN">英語</option>
      <option value="KO">韓国</option>
      <option value="FR">フランス</option>
      <option value="DE">ドイツ</option>
      <option value="ES">スペイン</option>
      <option value="IT">イタリア</option>
    </select>
    <ul>
      <pokemon-index
        v-for="pokemon in pokemons"
        v-bind:pokemon="pokemon.data"
        v-bind:local="local"
        :key="pokemon.data.id"
      ></pokemon-index>
    </ul>
    <paginate v-bind:response="response" @next-page="get"></paginate>
  </div>
</template>

<script>
import axios from 'axios'
import PokemonIndex from './components/PokemonIndex.vue'
import Paginate from './components/Paginate.vue'

const AREA = {
  kanto: '?offset=0&limit=21',
  johto: '?offset=151&limit=21',
  hohen: '?offset=251&limit=21',
  sinnoh: '?offset=386&limit=21',
  unova: '?offset=493&limit=21',
  karos: '?offset=650&limit=21',
  alola: '?offset=721&limit=21'
};
export default {
  name: 'app',
  data: function() {
    return {
      reaponse: {
        next: null
      },
      pokemons: [],
      base_url: `${this.$url}?offset=0&limit=21`,
      area: null,
      local: 'JP'
    }
  },
  methods: {
    get: async function(url = this.base_url) {
      try {
        let urls = [];
        let response = await axios.get(url);
        this.response = response.data;
        let items = this.response.results;
        for (let item of items) {
          urls.push(item.url);
        }
        this.pokemons = this.pokemons.concat(await Promise.all(urls.map(axios.get)));
      } catch(e){
        console.error(e);
      }
    },
  },
  mounted () {
    this.get();
  },
  watch: {
    area: function () {
      this.pokemons = [];
      this.get(`${this.$url}${AREA[this.area]}`);
    }
  },
  components: {
    PokemonIndex,
    Paginate
  }
}

</script>

<style>
#app{
  padding:0;
  width:100%;
  clear:both;
}

#app ul{
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  text-decoration: none;
  flex-wrap: wrap;
}
</style>

<template>
  <div id="app">
    search<input type="text" name="search">
    <select v-model="params.area">
      <option value="kanto">カントー</option>
      <option value="johto">ジョウト</option>
      <option value="hohen">ホウエン</option>
      <option value="4">シンオウ</option>
      <option value="5">イッシュ</option>
    </select>
    <ul>
      <pokemon-index
        v-for="pokemon in pokemons"
        v-bind:pokemon="pokemon.data"
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
  sinoh: '?offset=386&limit=21',
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
      base_url: 'https://pokeapi.co/api/v2/pokemon?offset=386&limit=21',
      params: {
        area: '',
      }
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
    search: function() {}
  },
  mounted () {
    this.get();
  },
  watch: {
    area: function () {
      this.search();
    }
  },
  components: {
    PokemonIndex,
    Paginate
  }
}

</script>

<style>
ul li{
  display: inline;
}
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
#app ul li{
  width:32%;
  background: #F2F2F2;
  box-sizing: border-box;
  margin-right:0.5%;
  margin-top:5px;
}
#app ul li:nth-child(3n){
  margin-right: 0.2%;
}
</style>

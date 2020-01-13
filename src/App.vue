<template>
  <div id="app">
    <div id="search-box">
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
      <input type="checkbox" id="toggle-check" />
      <label id="toggle-label" for="toggle-check">検索▼</label>
      <div id="toggle-content">
        ずかんNo または なまえ(英語のみ)：
        <input type="text" v-model="word">
        タイプ：
        <select v-model="type">
          <option value="all">すべて</option>
          <option value=1>ノーマル</option>
          <option value=2>かくとう</option>
          <option value=3>ひこう</option>
          <option value=4>どく</option>
          <option value=5>じめん</option>
          <option value=6>いわ</option>
          <option value=7>むし</option>
          <option value=8>ゴースト</option>
          <option value=9>はがね</option>
          <option value=10>ほのお</option>
          <option value=11>みず</option>
          <option value=12>くさ</option>
          <option value=13>でんき</option>
          <option value=14>エスパー</option>
          <option value=15>こおり</option>
          <option value=16>ドラゴン</option>
          <option value=17>あく</option>
          <option value=18>フェアリー</option>
        </select>
      </div>
    </div>
    <div id="main">
      <ul>
        <pokemon-index
          v-for="pokemon in pokemons"
          v-bind:pokemon="pokemon.data"
          v-bind:local="local"
          :key="pokemon.data.id"
        ></pokemon-index>
      </ul>
      <paginate v-bind:response="response" v-bind:empty="empty" @next-page="get"></paginate>
    </div>
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
      base_url: `${this.$url}pokemon?offset=0&limit=21`,
      empty: false,
      area: null,
      word: null,
      type: null,
      local: 'JP'
    }
  },
  methods: {
    get: async function(url = this.base_url) {
      try {
        const urls = [];
        const response = await axios.get(url);
        this.response = response.data;
        const items = this.response.results;
        for (let item of items) {
          urls.push(item.url);
        }
        this.pokemons = this.pokemons.concat(await Promise.all(urls.map(axios.get)));
        this.empty = false;
      } catch(e){
        this.empty = true;
        console.error(e);
      }
    },
    searchByWord: async function(url) {
      try {
        const response = await axios.get(url);
        this.pokemons.push(response);
        this.empty = false;
      } catch(e) {
        this.empty = true;
        console.error(e);
      }
    },
    searchByType: async function() {
      try {
        let urls = [];
        const response = await axios.get(`${this.$url}type/${this.type}`);
        const items = response.data.pokemon;
        for (let item of items) {
          urls.push(item.pokemon.url);
        }
        this.pokemons = this.pokemons.concat(await Promise.all(urls.map(axios.get)));
        this.empty = false;
      } catch(e){
        this.empty = true;
        console.error(e);
      }
    }
  },
  mounted () {
    this.get();
  },
  watch: {
    area: function () {
      this.pokemons = [];
      this.get(`${this.$url}pokemon${AREA[this.area]}`);
    },
    word: function() {
      this.pokemons = [];
      this.response.next = null;
      // APIは小文字のみ受付
      const word = this.word.toLowerCase();
      this.searchByWord(`${this.$url}pokemon/${word}`);
    },
    type: function() {
      this.pokemons = [];
      this.response.next = null;

      // タイプ：すべてが選択されたときは通常の検索
      if (this.type === 'all') {
        this.get();
      } else {
      this.searchByType();
      }
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

#search-box{
  position: fixed;
  background: #0e8fa1;
  color: #fff;
  top: 0;
  left: 0;
  margin: 0;
  padding: 10px;
  width: 100%;
  height: 20px;
}

#toggle-check{
  display: none;
}

#toggle-label{
  float: right;
  margin-right: 10px;
}

#toggle-content {
  background: #F4F5F7;
  color: #000;
  margin-top: 5px;
  border: 1px solid #333;
  height: 0;
  width: 100%;
  transition: .5s;
  visibility: hidden;
}
#toggle-check:checked + #toggle-label + #toggle-content{
  height: 40px;
  padding: 10px;
  visibility: visible;
}

#main {
  padding-top: 20px;
}
</style>

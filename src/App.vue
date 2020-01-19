<template>
  <div id="app">
    <header>
      <search-box
        v-bind:area.sync="area"
        v-bind:local.sync="local"
        v-bind:word.sync="word"
        v-bind:type.sync="type"
      ></search-box>
    </header>
    <div id="main">
      <ul>
        <pokemon-index
          v-for="pokemon in pokemons"
          v-bind:pokemon="pokemon.data"
          v-bind:local="local"
          :key="pokemon.data.id"
        ></pokemon-index>
      </ul>
        <div id="next">
          <p v-if="empty" id="empty">見つかりませんでした。</p>
          <p v-else-if="loading">Now Loading...</p>
          <p v-else-if="next" @mouseover="get(next)">もっとみる</p>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PokemonIndex from './components/PokemonIndex.vue'
import SearchBox from './components/SearchBox.vue'

export default {
  name: 'app',
  data: function() {
    return {
      pokemons: [],
      base_url: `${this.$url}pokemon?offset=0&limit=21`,
      loading: true,
      next: null,
      empty: false,
      area: 'kanto',
      word: null,
      type: null,
      local: 'JP'
    }
  },
  methods: {
    get: async function(url = this.base_url) {
      try {
        this.loading = true;
        const urls = [];
        const response = await axios.get(url);
        this.next = response.data.next;
        const items = response.data.results;
        for (let item of items) {
          urls.push(item.url);
        }
        this.pokemons = this.pokemons.concat(await Promise.all(urls.map(axios.get)));
        this.empty = false;
      } catch(e){
        this.empty = true;
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    searchByWord: async function(url) {
      try {
        this.pokemons = [];
        this.loading = true;
        this.next = null;
        const response = await axios.get(url);
        this.pokemons.push(response);
        this.empty = false;
      } catch(e) {
        this.empty = true;
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    searchByType: async function() {
      try {
        this.pokemons = [];
        this.loading = true;
        this.next = null
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
      } finally {
        this.loading = false;
      }
    }
  },
  created () {
    this.get();
  },
  watch: {
    area: function () {
      this.pokemons = [];
      this.get(`${this.$url}pokemon${this.$area[this.area]}`);
    },
    word: function() {
      // APIは小文字のみ受付
      const word = this.word.toLowerCase();
      this.searchByWord(`${this.$url}pokemon/${word}`);
    },
    type: function() {
      // タイプ：すべてが選択されたときは通常の検索
      if (this.type === 'all') {
        this.get();
      } else {
      this.searchByType();
      }
    }
  },
  components: {
    SearchBox,
    PokemonIndex,
  }
}

</script>

<style scoped>
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

#main {
  padding-top: 20px;
}

#next {
  cursor : pointer;
  text-align: center;
  font-size: 25px;
}
#empty {
  position: absolute;
  top:50%;
  left: 0;
  right: 0;
  margin: auto;
}
p {
  padding: 0.5em 1em;
  text-decoration: none;
  background: #668ad8;/*ボタン色*/
  color: #FFF;
  border-bottom: solid 4px #627295;
  border-radius: 3px;
}

</style>

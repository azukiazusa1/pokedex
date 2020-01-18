<template>
  <li class="pokemon-index">
      <h3 @click=openModal>{{ pokemon.id }}. {{ getI18nName }}</h3>
    <span class="circle">
      <img v-bind:src="getSprites" @click=chengeSprites />
    </span>
      <div>{{ getI18nType }}</div>
      <div>{{ getI18nGenera }}</div>
      <div>たかさ: {{ pokemon.height / 10 }}m</div>
      <div>おもさ: {{ pokemon.weight / 10 }}Kg</div>
      <div>
        <pokemon-details
          @close="closeModal"
          v-if="modal"
          v-bind:pokemon="pokemon"
          v-bind:species="species"
          v-bind:type="getI18nType"
          v-bind:name="getI18nName"
          v-bind:genera="getI18nGenera"
          v-bind:sprites="getSprites"
          v-bind:local="local"
        >
        </pokemon-details>
      </div>
  </li>
</template>

<script>
import axios from 'axios'
import PokemonDetails from '../components/PokemonDetails.vue'

export default {
  props: {
    pokemon: Object,
    local: String
  },
  data: function() {
    return {
      species : null,
      types: [],
      modal: false,
      front: true,
      shiny: false,
    }
  },
  mounted () {
    // 色違いの判定
    if (Math.random() < 0.03) {
      this.shiny = true;
    }
    this.getSpecies();
    this.getTypes();
  },
  computed: {
    getI18nName: function() {
      if (this.species !== null) {
        let names = this.species.names;
        let result = names.find(v => v.language.name === this.$language[this.local]);
        return result.name;
      }
    },
    getI18nFlavorText: function() {
      if (this.species !== null) {
        let flavor_text_entries = this.species.flavor_text_entries;
        let result = flavor_text_entries.find(v => v.language.name === this.$language[this.local]);
        return result.flavor_text;
      }
    },
    getI18nGenera: function() {
      if (this.species !== null) {
        let genera = this.species.genera;
        let result = genera.find(v => v.language.name === this.$language[this.local]);
        return result.genus;
      }
    },
    getSprites: function() {
      if (this.shiny) {
          if (this.front) {
            return this.pokemon.sprites.front_shiny;
          } else {
            return this.pokemon.sprites.back_shiny;
          }
      } else {
        if (this.front) {
          return this.pokemon.sprites.front_default;
        } else {
          return this.pokemon.sprites.back_default;
        }
      }
    },
    getI18nType: function() {
      let types = '';
      for (const type of this.types) {
        const type_name = type.names.find(v => v.language.name === this.$language[this.local]);
        types += `《${type_name.name}》`;
      }
      return types;
    }
  },
  methods: {
    getSpecies: async function() {
      try {
        const species = await axios.get(this.pokemon.species.url);
        return this.species = species.data;
      } catch(err){
        console.error(err);
      }
    },
    getTypes: async function () {
      for (const type of this.pokemon.types) {
        let result = await axios.get(type.type.url);
        this.types.push(result.data);
      }
    },
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    chengeSprites() {
      this.front = !this.front;
    }
  },
  components: {
    PokemonDetails
  }
}

</script>

<style scoped>
@media screen and (max-width: 480px) {
  li{
    display: inline;
    width:90%;
    height:32%;
    background: #FFFFFF;
    box-sizing: border-box;
    margin-right:0.5%;
    margin-top:5px;
    border-radius: 10px
  }
}
@media screen and (min-width: 481px){
  li{
    display: inline;
    width:32%;
    height:32%;
    background: #FFFFFF;
    box-sizing: border-box;
    margin-right:0.5%;
    margin-top:5px;
    border-radius: 10px
  }
  li:nth-child(3n){
    margin-right: 0.2%;
  }
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ccc;
}
img, h3 {
  cursor: pointer;
}

.pokemon-index {
  text-align: center;
}
h3 {
  text-decoration: underline;
}
img {
  transition-duration: 0.3s;
}
img:hover {
  transform: scale(1.5);
  transition-duration: 0.3s;
}
</style>
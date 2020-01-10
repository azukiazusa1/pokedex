<template>
  <li class="pokemon-index">
      <h3 @click=openModal>{{ pokemon.id }}. {{ getI18nName }}</h3>
    <span class="circle">
      <img v-bind:src="getSprites" @click=chengeSprites />
    </span>
      <div>{{ getType }}</div>
      <div>{{ getI18nGenera }}</div>
      <div>たかさ: {{ pokemon.height / 10 }}m</div>
      <div>おもさ: {{ pokemon.weight / 10 }}Kg</div>
      <div>
        <pokemon-details @close="closeModal" v-if="modal">
          {{ getI18nFlavorText }}
        </pokemon-details>
      </div>
  </li>
</template>

<script>
import axios from 'axios'
import PokemonDetails from '../components/PokemonDetails.vue'

const LANGUAGE = {
  JP: 'ja'
};
export default {
  props: ['pokemon'],
  data: function() {
    return {
      species : null,
      modal: false,
      front: true,
      shiny: false
    }
  },
  mounted () {
    (async () => {
      try {
        if (Math.random() < 0.03) {
          this.shiny = true;
        }
        let species = await axios.get(this.pokemon.species.url);
        return this.species = species.data;
      } catch(err){
        console.error(err);
      }
    })();
  },
  computed: {
    getType: function () {
      let types = this.pokemon.types;
      if (types.length === 2) {
        return `《${types[0].type.name}》《${types[1].type.name}》`;
      } else {
        return `《${types[0].type.name}》 `;
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
    }
  },
  methods: {
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
li{
  display: inline;
}
li{
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
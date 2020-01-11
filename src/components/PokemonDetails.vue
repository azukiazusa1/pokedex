<template>
	<transition name="modal" appear>
	    <div class="modal modal-overlay" @click.self="$emit('close')">
	    	<div class="modal-window">
	        	<div class="modal-content">
            <div>{{ pokemon.id }}. {{ name }}</div>
            <div>{{ type }}</div>
            <div>{{ genera }}</div>
            <div>たかさ: {{ pokemon.height / 10 }}m</div>
            <div>おもさ: {{ pokemon.weight / 10 }}Kg</div>
	        	<div>{{ getI18nFlavorText }}</div>
            <div v-for="ability in pokemon.abilities">
              <p>{{ ability.ability.name }}</p>
            </div>

          <table>
            <tr>
              <td>　HP　</td><td>こうげき</td><td>ぼうぎょ</td><td>とくこう</td><td>とくぼう</td><td>すばやさ</td>
            </tr>
              <td>{{ pokemon.stats[0].base_stat }}</td>
              <td>{{ pokemon.stats[1].base_stat }}</td>
              <td>{{ pokemon.stats[2].base_stat }}</td>
              <td>{{ pokemon.stats[3].base_stat }}</td>
              <td>{{ pokemon.stats[4].base_stat }}</td>
              <td>{{ pokemon.stats[5].base_stat }}</td>
            </tr>
          </table>
          <div v-for="evo in evolution_chain">
              <p>{{ evo }}</p>
            </div>
	    		</div>
	    	</div>
	    </div>
	</transition>
</template>

<script>
import axios from 'axios'
const LANGUAGE = {
  JP: 'ja'
};

export default {
  props: [
  'pokemon',
  'species',
  'type',
  'name',
  'genera',
  'sprites'
  ],
  data: function() {
    return {
      evolution_chain: null
    }
  },
  mounted() {
    this.getEvolutionChain();
  },
  computed: {
    getI18nFlavorText: function() {
      let flavor_text_entries = this.species.flavor_text_entries;
      let result = flavor_text_entries.find(v => v.language.name === LANGUAGE.JP);
      return result.flavor_text;
    },

    getEvolutionChain: async function() {
      const chain = [];
      const url = this.species.evolution_chain.url;
      const evolution_chain = await axios.get(url);
      chain.push(evolution_chain.data.chain.species.name);
      for (let ev of evolution_chain.data.chain.evolves_to) {
        chain.push(ev.species.name);
        for (let e of ev.evolves_to) {
          chain.push(e.species.name);
        }
      }
      this.evolution_chain = chain;
    }
  }
}
</script>

<style lang="stylus" scoped>
.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-window {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
  }

  &-content {
    padding: 10px 20px;
  }

  &-footer {
    background: #ccc;
    padding: 10px;
    text-align: right;
  }
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

th,td {
  border: solid 1px;
}

table {
  border-collapse:  collapse;
}
</style>
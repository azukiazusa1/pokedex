<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-content">
          <div class='flex'>
            <div class="b">
              <div>{{ pokemon.id }}. {{ name }}</div>
                <img v-bind:src="sprites"/>
              </div>
            <div class="c">
              <div>{{ type }}</div>
              <div>{{ genera }}</div>
              <div>たかさ: {{ pokemon.height / 10 }}m</div>
              <div>おもさ: {{ pokemon.weight / 10 }}Kg</div>
            </div>
            <div class="d">
              <div>とくせい</div>
              <div v-for="(ability, index) in abilities" :key="index">
                <div>
                  {{ ability.name }}
                  <span @mouseover="showTooltiptext(index)" @mouseout="closeTooltiptext(index)" class="tooltip">?</span>
                </div>
                <span v-if="tooltiptext[index]" class="tooltiptext">{{ ability.flavor_text }}</span>
              </div>
            </div>
          </div>
          <div class="flavor_text">
            {{ getI18nFlavorText }}
          </div>
          <div class="flex">
            <div id="stats">
              <h4>のうりょく</h4>
              <table>
                <tr>
                  <td>HP</td><td>こうげき</td><td>ぼうぎょ</td><td>とくこう</td><td>とくぼう</td><td>すばやさ</td>
                </tr>
                <tr>
                  <td>{{ pokemon.stats[5].base_stat }}</td>
                  <td>{{ pokemon.stats[4].base_stat }}</td>
                  <td>{{ pokemon.stats[3].base_stat }}</td>
                  <td>{{ pokemon.stats[2].base_stat }}</td>
                  <td>{{ pokemon.stats[1].base_stat }}</td>
                  <td>{{ pokemon.stats[0].base_stat }}</td>
                </tr>
              </table>
            </div>
            <div id="egg-group">
              <h4>たまごグループ</h4>
              <ul v-for="(egg_group, index) in egg_groups" :key="index">
                <li>{{ egg_group.name }}</li>
              </ul>
            </div>
          </div>
          <h4>しんか</h4>
          <div class="flex evo">
            <div class="evo" v-for="(evo, index) in evolution_chain" :key="index">
              <p class="evo">{{ evo }}</p>
            </div>
          </div>
          <div>
            <a class="close" @click.self="$emit('close')">閉じる</a>
          </div>
        </div>
     </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'

export default {
  props: [
  'pokemon',
  'species',
  'type',
  'name',
  'genera',
  'sprites',
  'local'
  ],
  data: function() {
    return {
      evolution_chain: null,
      egg_groups: [],
      abilities: [],
      tooltiptext: {
        0: false,
        1: false,
        2: false
      }
    }
  },

  mounted() {
    this.getEvolutionChain();
    this.getI18nAbilities();
    this.getI18nEggGroups();
  },
  computed: {

    getI18nFlavorText: function() {
      const flavor_text_entries = this.species.flavor_text_entries;
      const result = flavor_text_entries.find(v => v.language.name === this.$language[this.local]);
      return result.flavor_text;
    },
  },
  methods: {
    getI18nAbilities: async function() {
      for (const ability of this.pokemon.abilities) {
        const result = await axios.get(ability.ability.url);
        const ability_name = result.data.names.find(v => v.language.name === this.$language[this.local]);
        const ability_flavor_text = result.data.flavor_text_entries.find(v => v.language.name === this.$language[this.local]);
        const full_abliity = {
          name: `${ability.slot}： ${ability_name.name}`,
          flavor_text: ability_flavor_text.flavor_text
        }
        this.abilities.unshift(full_abliity);
      }
    },
    getI18nEggGroups: async function () {
      for (const egg_group of this.species.egg_groups) {
        const result = await axios.get(egg_group.url);
        const egg_group_name = result.data.names.find(v => v.language.name === this.$language[this.local]);
        this.egg_groups.push(egg_group_name);
      }
    },
    getEvolutionChain: async function() {
      const chain = [];
      const url = this.species.evolution_chain.url;
      const evolution_chain = await axios.get(url);
      const species = await axios.get(evolution_chain.data.chain.species.url);
      const result = species.data.names.find(v => v.language.name === this.$language[this.local]);
      chain.push(`${species.data.id}. ${result.name}`);
      for (let ev of evolution_chain.data.chain.evolves_to) {
        const species = await axios.get(ev.species.url);
        const result = species.data.names.find(v => v.language.name === this.$language[this.local]);
        chain.push(`${species.data.id}. ${result.name}`);
        for (let e of ev.evolves_to) {
          const species = await axios.get(e.species.url);
          const result = species.data.names.find(v => v.language.name === this.$language[this.local]);
          chain.push(`${species.data.id}. ${result.name}`);
        }
      }
      this.evolution_chain = chain;
    },
    showTooltiptext: function(index) {
      this.tooltiptext[index] = true;
    },
    closeTooltiptext: function(index) {
      this.tooltiptext[index] = false;
    }
  }
}
</script>

<style lang="stylus">
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
  @media screen and (min-width: 769px) {
    &-window {
      background: #fff;
      overflow: hidden;
      border-radius: 5px;
    }
  }
  @media screen and (max-width: 768px) and (max-width: 480px) {
    &-window {
      width: 80%;
      height: 70%;
      background: #fff;
      overflow-y: auto;
      border-radius: 5px;
    }
  }

  &-content {
    background-color: #D9E5FF;
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
  background-color: #f2f2f2;
  table-layout: fixed;
  width: 100%
}

.tooltip {
  position: relative;
  border-bottom: 1px solid;
}

@media screen and (min-width: 769px) {
  .tooltiptext {
    width: 200px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    margin: auto;
    z-index: 1;
  }
  .flex{
    display:flex
  }

  .b{
    width: 30%
    background-color: #f2f2f2
    margin: 5px
    border-radius: 50%
  }

  .c {
    width: 40%
    background-color: #f2f2f2
    margin: 5px
    border-radius: 50%
  }

  .d {
    background-color: #f2f2f2
    margin: 5px
    width: 30%
    border-radius: 50%
  }

  #stats {
    width: 40%;
  }

  #egg-groups {
    width: 60%;
    margin: 10px;
  }
}
@media screen and (max-width: 768px) and (max-width: 480px) {

  .tooltiptext {
    width: 200px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1;
  }

  .b{
    display: inline-block
    text-align: center
    width: 80%
    height: 50%
    background-color: #f2f2f2
    margin: 5px
    border-radius: 50%
  }
  .c, .d {
    margin-top: 5px
    margin-bottom: 5px
    width: 100%
    background-color: #f2f2f2
    border-radius: 50%
  }
}

.flavor_text {
  content: "\A";
  border: groove;
  background-color: #C0C0C0;
}

.evo {
  text-align:center;
}

.close {
  display: inline-block;
  padding: 7px 20px;
  border-radius: 25px;
  text-decoration: none;
  color: #FFF;
  background-image: linear-gradient(45deg, #d6d6d6 0%, #636363 100%);
  transition: .4s;
  border-bottom: solid 4px #627295;
}
</style>
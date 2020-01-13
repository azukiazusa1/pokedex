<template>
  <span id="next">
    <p v-if="empty" id="empty">見つかりませんでした。</p>
    <p v-else-if="loading">Now Loading...</p>
    <p id="next" v-else-if="response.next" @mouseover="nextPage">もっとみる</p>
  </span>
</template>

<script>
export default {
  props: ['response', 'empty'],
  data: function() {
    return {
      loading: true,
    }
  },
  methods: {
    nextPage() {
      this.loading = true;
      this.$emit('next-page', this.response.next);
    }
  },
  watch: {
    response: function (){
      this.loading = false;
    }
  }
}

</script>

<style scoped>
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